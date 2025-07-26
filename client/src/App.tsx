import { Router, Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ProfileFormPage from './pages/ProfileFormPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/verify-otp" component={OTPVerificationPage} />
          <Route path="/profile-form" component={ProfileFormPage} />
          <ProtectedRoute path="/assessment" component={AssessmentPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl font-bold">Página no encontrada</h1>
            </div>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;