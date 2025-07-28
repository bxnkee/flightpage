import { Switch, Route } from 'wouter';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatWidget } from './components/ChatWidget';
import { useAuth } from './hooks/useAuth';
import { MainApp } from './components/MainApp';

export function App() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-white">
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route>
          <MainApp />
        </Route>
      </Switch>
      <ChatWidget />
    </div>
  );
}