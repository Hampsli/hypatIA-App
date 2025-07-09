import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowLeft, User, Mail, Lock, Briefcase, Calendar } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  age: z.number().min(18, 'Debes ser mayor de 18 años').max(100, 'Edad inválida'),
  currentRole: z.string().min(1, 'Rol actual es requerido'),
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setMessage('');

    try {
      const { confirmPassword, acceptTerms, ...userData } = data;
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registro exitoso. Código de verificación enviado a tu email.');
        localStorage.setItem('pendingEmail', data.email);
        setTimeout(() => {
          setLocation('/verify-otp');
        }, 2000);
      } else {
        setMessage(result.error || 'Error al registrarse');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="absolute top-4 left-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <div className="text-2xl font-bold hypatia-text-gradient mb-2">hypatIA</div>
            <CardTitle>Crear Cuenta</CardTitle>
            <p className="text-sm text-gray-600">
              Únete a la comunidad de mujeres en STEM
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('name')}
                    placeholder="Tu nombre completo"
                    className="pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Edad</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register('age', { valueAsNumber: true })}
                      type="number"
                      placeholder="25"
                      className="pl-10"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="currentRole">Rol Actual</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register('currentRole')}
                      placeholder="Ej: Desarrolladora"
                      className="pl-10"
                    />
                  </div>
                  {errors.currentRole && (
                    <p className="text-sm text-red-500 mt-1">{errors.currentRole.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="mt-1"
                />
                <div className="text-sm">
                  <p>
                    Acepto los{' '}
                    <a href="#" className="text-primary hover:underline">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-primary hover:underline">
                      política de privacidad
                    </a>
                  </p>
                  {errors.acceptTerms && (
                    <p className="text-red-500 mt-1">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${
                  message.includes('exitoso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => setLocation('/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                Aviso de Privacidad y Manejo de Datos
              </h4>
              <p className="text-xs text-amber-700">
                Tus datos serán utilizados exclusivamente para brindarte una experiencia 
                personalizada en hypatIA. Cumplimos con todas las regulaciones de protección 
                de datos y nunca compartiremos tu información personal sin tu consentimiento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}