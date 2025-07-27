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
import { Select } from '@/components/ui/Select';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  ageRange: z.string(),
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
       localStorage.setItem('pendingEmail', data.email);
      setLocation('/profile-form');
      // const { confirmPassword, ...userData } = data;
      // //Note: Pending conect with backend
      // const response = await fetch('', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });

      // const result = await response.json();

    //  if (response.ok) {
    //    setMessage('Registro exitoso. Código de verificación enviado a tu email.');
    //    localStorage.setItem('pendingEmail', data.email);
    //   setTimeout(() => {
    //   setLocation('/verify-otp');
    //  }, 2000);
    //   } else {
    //    setMessage(result.error || 'Error al registrarse');
    //  }
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
                className="top-4 left-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <CardTitle>Crear Cuenta - HypatIA </CardTitle>
            <p className="text-sm text-gray-600">
              Bienvenida al sistema de HypatIA. Completa el formulario para crear tu cuenta y acceder a todas las funcionalidades.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} >
              <div className=''>
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
                  <Label htmlFor="ageRange">Edad</Label>
                    <Select className="pl-10" {...register('ageRange')}>
                        <option value="">Seleccionar...</option>
                        <option value="20-24">20-24</option>
                        <option value="25-29">25-29</option>
                        <option value="30-34">30-34</option>
                        <option value="35-39">35-39</option>
                         <option value="40-44">40-44</option>
                         <option value="45-49">45-49</option>
                     </Select>
                  {errors.ageRange && (
                    <p className="text-sm text-red-500 mt-1">{errors.ageRange.message}</p>
                  )}
                </div>

                {/* <div>
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
                </div> */}
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

              <div className='mb-2'>
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

              {/* <div className="flex items-start space-x-2">
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
              </div> */}

              {message && (
                <div className={`text-sm p-3 rounded ${message.includes('exitoso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
                Consentimiento Informado para Participación en Programa Beta (MVP)
              </h4>
              <p className="text-xs text-amber-700">
                1. Objetivo del Programa Beta: Este documento tiene como finalidad informarte sobre tu participación en la fase de Producto Mínimo Viable (MVP) beta de HypatIA. Nuestro objetivo es probar la funcionalidad, usabilidad y valor de nuestra plataforma, así como recopilar tus comentarios y sugerencias para mejorar el servicio y afinar nuestro modelo de trabajo.
                2. Naturaleza del MVP y Riesgos: Entiendes y aceptas que HypatIA en esta fase es un producto en desarrollo. Esto implica que puede contener errores, fallas de funcionamiento, interrupciones, inconsistencias en la información o datos, y no todas las funcionalidades pueden estar operativas o completas. Aunque nos esforzamos por proteger tus datos, existe un riesgo mínimo inherente a la participación en pruebas de software, como la posible pérdida de datos de prueba o inestabilidad del servicio.
                3. Tu Rol como Beta Tester: Tu participación es crucial para nosotros. Se espera que utilices la plataforma de acuerdo con las instrucciones proporcionadas y, si es posible, proporciones retroalimentación honesta y constructiva sobre tu experiencia, incluyendo la identificación de errores, sugerencias de mejora y observaciones generales. Nos reservamos el derecho de recopilar datos de uso y comportamiento dentro de la plataforma para fines de mejora del producto.
                4. Confidencialidad: La información a la que accedas durante tu participación en este programa beta, incluyendo funcionalidades, diseño, procesos, datos internos y cualquier otra información no pública de HypatIA, es considerada confidencial. Te comprometes a no divulgar esta información a terceros sin el consentimiento expreso por escrito de HypatIA. Sin embargo, reconocemos que la retroalimentación abierta es esencial para un MVP. Si el programa específico requiere una confidencialidad más estricta sobre la existencia misma del producto, te será comunicado y se te pedirá firmar un acuerdo de confidencialidad adicional (NDA).
                5. Uso de Datos y Retroalimentación: Al participar, nos otorgas permiso para utilizar la retroalimentación, sugerencias, informes de errores y cualquier otro contenido que proporciones en relación con el MVP, para mejorar y desarrollar nuestros productos y servicios, sin obligación de compensación para ti. Tus datos personales serán tratados conforme a nuestro Aviso de Privacidad.
                6. Ausencia de Compensación y Relación Laboral: Tu participación en este programa beta es voluntaria y no implica una relación laboral, contractual de servicios remunerados o de cualquier otra índole que genere derechos a compensación económica o beneficios por tu parte, salvo que se especifique lo contrario y por escrito.
                7. Terminación de la Participación: Puedes finalizar tu participación en el programa beta en cualquier momento contactandonos. HypatIA también se reserva el derecho de terminar tu acceso al programa beta en cualquier momento y por cualquier motivo, sin previo aviso.
                8. Aceptación: Al hacer clic en "Acepto" o al continuar utilizando la plataforma HypatIA en esta fase beta, confirmas que has leído y entendido los términos de este Consentimiento Informado y aceptas participar bajo estas condiciones.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}