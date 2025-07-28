import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertChatMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware for authentication
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedUsers = new Map<number, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'authenticate') {
          try {
            const decoded = jwt.verify(message.token, JWT_SECRET) as any;
            const user = await storage.getUser(decoded.userId);
            if (user) {
              connectedUsers.set(user.id, ws);
              ws.send(JSON.stringify({ type: 'authenticated', userId: user.id }));
            }
          } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }));
          }
        } else if (message.type === 'chat_message') {
          const decoded = jwt.verify(message.token, JWT_SECRET) as any;
          const user = await storage.getUser(decoded.userId);
          
          if (user) {
            const chatMessage = await storage.createChatMessage({
              userId: user.id,
              message: message.content,
              isGlobal: true,
            });

            // Broadcast to all connected users
            const broadcastMessage = {
              type: 'new_message',
              id: chatMessage.id,
              userId: user.id,
              userFirstName: user.firstName,
              userLastName: user.lastName,
              message: chatMessage.message,
              createdAt: chatMessage.createdAt,
            };

            connectedUsers.forEach((userWs) => {
              if (userWs.readyState === WebSocket.OPEN) {
                userWs.send(JSON.stringify(broadcastMessage));
              }
            });
          }
        }
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      // Remove user from connected users when they disconnect
      for (const [userId, userWs] of connectedUsers.entries()) {
        if (userWs === ws) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Flight routes
  app.get('/api/flights', async (req, res) => {
    try {
      const flights = await storage.getFlights();
      res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ message: 'Failed to fetch flights' });
    }
  });

  app.get('/api/flights/search', async (req, res) => {
    try {
      const { from, to, date } = req.query;
      
      if (!from || !to || !date) {
        return res.status(400).json({ message: 'From, to, and date parameters required' });
      }

      const flights = await storage.searchFlights(from as string, to as string, date as string);
      res.json(flights);
    } catch (error) {
      console.error('Error searching flights:', error);
      res.status(500).json({ message: 'Failed to search flights' });
    }
  });

  // Booking routes
  app.post('/api/bookings', authenticateToken, async (req: any, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Booking creation error:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  app.get('/api/bookings', authenticateToken, async (req: any, res) => {
    try {
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/bookings/:reference', async (req, res) => {
    try {
      const booking = await storage.getBookingByReference(req.params.reference);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  });

  // Chat routes
  app.get('/api/chat/messages', authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getGlobalChatMessages(50);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Review routes
  app.post('/api/reviews', authenticateToken, async (req: any, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Review creation error:', error);
      res.status(500).json({ message: 'Failed to create review' });
    }
  });

  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviews(20);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  });

  app.get('/api/reviews/rating', async (req, res) => {
    try {
      const rating = await storage.getAverageRating();
      res.json({ rating });
    } catch (error) {
      console.error('Error fetching rating:', error);
      res.status(500).json({ message: 'Failed to fetch rating' });
    }
  });

  return httpServer;
}
