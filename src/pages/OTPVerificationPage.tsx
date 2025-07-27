import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowLeft, Shield } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, 'El código debe tener 6 dígitos'),
});

type OTPData = z.infer<typeof otpSchema>;

export default function OTPVerificationPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingEmail');
    if (!pendingEmail) {
      setLocation('/login');
      return;
    }
    setEmail(pendingEmail);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMessage('El código ha expirado. Por favor, solicita uno nuevo.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  const onSubmit = async (data: OTPData) => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.token, result.user);
        localStorage.removeItem('pendingEmail');
        
        // Redirect based on first login status
        if (result.user.isFirstLogin) {
          setLocation('/profile-form');
        } else {
          setLocation('/dashboard');
        }
      } else {
        setMessage(result.error || 'Código inválido');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/login')}
                className="absolute top-4 left-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <div className="w-16 h-16 hypatia-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="text-2xl font-bold hypatia-text-gradient mb-2">hypatIA</div>
            <CardTitle>Verificación de Código</CardTitle>
            <p className="text-sm text-gray-600">
              Hemos enviado un código de 6 dígitos a<br />
              <strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="otp">Código de Verificación</Label>
                <Input
                  {...register('otp')}
                  placeholder="123456"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  El código expira en:{' '}
                  <span className={`font-mono font-bold ${
                    timeLeft <= 30 ? 'text-red-500' : 'text-primary'
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${
                  message.includes('expirado') || message.includes('inválido') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || timeLeft === 0}
              >
                {isLoading ? 'Verificando...' : 'Verificar Código'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                ¿No recibiste el código?{' '}
                <button
                  onClick={() => setLocation('/login')}
                  className="text-primary hover:underline font-medium"
                  disabled={timeLeft > 0}
                >
                  Solicitar nuevo código
                </button>
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Consejo:</strong> Revisa tu carpeta de spam si no encuentras el email. 
                El código es válido solo por 2 minutos por seguridad.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}