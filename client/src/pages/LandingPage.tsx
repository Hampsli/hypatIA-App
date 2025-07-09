import { useLocation } from 'wouter';
import { Button } from '../components/ui/Button';
import { ArrowRight, Target, Users, TrendingUp, Brain, Award, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold hypatia-text-gradient">hypatIA</div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => setLocation('/login')}>
            Iniciar Sesión
          </Button>
          <Button onClick={() => setLocation('/register')}>
            Registrarse
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Potencia tu carrera en 
          <span className="hypatia-text-gradient"> STEM</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Descubre tus fortalezas, identifica oportunidades de crecimiento y 
          cierra la brecha de habilidades con nuestra plataforma inteligente de gestión de competencias.
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 h-auto hypatia-gradient hover:opacity-90"
          onClick={() => setLocation('/register')}
        >
          Comienza tu Evaluación Gratuita
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* About hypatIA Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Sobre hypatIA</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Nombrada en honor a Hipatia de Alejandría, la primera mujer matemática de la historia, 
              nuestra plataforma está diseñada específicamente para empoderar a las mujeres en campos STEM.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 hypatia-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Análisis Preciso</h3>
              <p className="text-gray-600">
                Evaluación integral de habilidades técnicas y blandas con metodología 
                respaldada por investigación en diversidad en STEM.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 hypatia-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Desarrollo Personalizado</h3>
              <p className="text-gray-600">
                Planes de desarrollo únicos que consideran los desafíos específicos 
                que enfrentan las mujeres en tecnología.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 hypatia-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Crecimiento Medible</h3>
              <p className="text-gray-600">
                Seguimiento continuo de tu progreso con métricas que realmente 
                importan para tu carrera profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-700 mb-6">
                Creemos que cada mujer en STEM tiene un potencial único que merece ser reconocido 
                y desarrollado. Nuestro equipo de expertas en psicología organizacional, 
                ingeniería y ciencia de datos ha creado una plataforma que no solo identifica 
                brechas de habilidades, sino que también comprende el contexto único en el que 
                las mujeres desarrollan sus carreras tecnológicas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Evaluaciones libres de sesgos de género</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Consideración de factores de conciliación vida-trabajo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Red de mentoras y profesionales experimentadas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Recursos específicos para el desarrollo en STEM</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 hypatia-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-32 w-32 text-white" />
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Más de 10,000 mujeres ya han transformado sus carreras con hypatIA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">¿Qué incluye tu evaluación?</h2>
            <p className="text-xl text-gray-600">
              Un análisis completo diseñado específicamente para tu realidad profesional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Award className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Perfil Profesional</h3>
              <p className="text-sm text-gray-600">
                Análisis de tu trayectoria, experiencia y objetivos profesionales
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Brain className="h-8 w-8 text-cyan-600 mb-4" />
              <h3 className="font-semibold mb-2">Habilidades Técnicas</h3>
              <p className="text-sm text-gray-600">
                Evaluación de competencias específicas en tu área de tecnología
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Power Skills</h3>
              <p className="text-sm text-gray-600">
                Análisis de habilidades de liderazgo, comunicación y trabajo en equipo
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <TrendingUp className="h-8 w-8 text-cyan-600 mb-4" />
              <h3 className="font-semibold mb-2">Plan de Desarrollo</h3>
              <p className="text-sm text-gray-600">
                Recomendaciones personalizadas para tu crecimiento profesional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 hypatia-gradient text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            ¿Lista para descubrir tu potencial?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de mujeres que ya están transformando sus carreras en STEM. 
            Tu primera evaluación es completamente gratuita.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => setLocation('/register')}
          >
            Comenzar mi Evaluación Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-2xl font-bold hypatia-text-gradient mb-4">hypatIA</div>
          <p className="text-gray-400">
            Empoderando a las mujeres en STEM para alcanzar su máximo potencial
          </p>
          <div className="mt-4 text-sm text-gray-500">
            © 2024 hypatIA. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}