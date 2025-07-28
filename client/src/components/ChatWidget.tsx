import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  message: string;
  createdAt: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch initial chat messages
  const { data: initialMessages } = useQuery({
    queryKey: ['chat', 'messages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/chat/messages');
      return await response.json();
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages.reverse());
    }
  }, [initialMessages]);

  // WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Authenticate with the WebSocket
      ws.send(JSON.stringify({ type: 'authenticate', token }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'authenticated') {
        console.log('WebSocket authenticated');
      } else if (data.type === 'new_message') {
        setMessages(prev => [...prev, {
          id: data.id,
          userId: data.userId,
          userFirstName: data.userFirstName,
          userLastName: data.userLastName,
          message: data.message,
          createdAt: data.createdAt,
        }]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [isAuthenticated, user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    socket.send(JSON.stringify({
      type: 'chat_message',
      token,
      content: newMessage.trim(),
    }));

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-white" />
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Customer Chat</h3>
                <p className="text-xs opacity-90">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.userId === user?.id
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.userId !== user?.id && (
                      <div className="text-xs font-medium mb-1">
                        {message.userFirstName} {message.userLastName}
                      </div>
                    )}
                    <div className="text-sm">{message.message}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.userId === user?.id ? 'text-sky-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={!isConnected}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                size="sm"
                className="bg-sky-500 hover:bg-sky-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}