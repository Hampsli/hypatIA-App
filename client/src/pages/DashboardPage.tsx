import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  LogOut, 
  User, 
  Award, 
  TrendingUp,
  Target,
  Calendar,
  Bell
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('assessment');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'assessment', label: 'Assessment', icon: BarChart3 },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold hypatia-text-gradient">hypatIA</div>
            <div className="text-gray-600">
              Bienvenida, <span className="font-medium">{user?.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Dashboard</h1>
                <p className="text-gray-600">
                  Visualiza tu progreso y análisis de habilidades
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 hypatia-gradient rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Evaluación Completada</p>
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fortalezas Identificadas</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Áreas de Mejora</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Días desde Evaluación</p>
                        <p className="text-2xl font-bold text-gray-900">1</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados de tu Evaluación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">🎯 Fortalezas Principales</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Comunicación efectiva en equipos multidisciplinarios</li>
                          <li>• Adaptabilidad a nuevas tecnologías</li>
                          <li>• Pensamiento analítico y resolución de problemas</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className="font-semibold text-amber-800 mb-2">📈 Oportunidades de Crecimiento</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• Liderazgo en proyectos complejos</li>
                          <li>• Manejo de conflictos en equipos</li>
                          <li>• Presentaciones ejecutivas</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan de Desarrollo Personalizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold mb-1">Próximos 30 días</h4>
                        <p className="text-sm text-gray-600">
                          Enfócate en desarrollar habilidades de presentación y comunicación ejecutiva
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">Próximos 90 días</h4>
                        <p className="text-sm text-gray-600">
                          Participa en proyectos de liderazgo y toma cursos de gestión de equipos
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-1">Próximos 6 meses</h4>
                        <p className="text-sm text-gray-600">
                          Busca oportunidades de mentoría y considera aplicar a posiciones senior
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Training & Development</h1>
                <p className="text-gray-600">
                  Programas de capacitación personalizados para tu crecimiento profesional
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Liderazgo en Tech</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Desarrolla habilidades de liderazgo específicas para el sector tecnológico
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        6 semanas • 12 horas
                      </div>
                      <Button className="w-full">Comenzar Curso</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comunicación Efectiva</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Mejora tu comunicación en equipos multidisciplinarios
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        4 semanas • 8 horas
                      </div>
                      <Button className="w-full" variant="outline">En Lista de Espera</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gestión de Proyectos Ágiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Aprende metodologías ágiles para liderar proyectos tecnológicos
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        8 semanas • 16 horas
                      </div>
                      <Button className="w-full">Explorar Curso</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mentorship Tab */}
          {activeTab === 'mentorship' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
                <p className="text-gray-600">
                  Conecta con mentoras experimentadas en tu área de tecnología
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Encuentra tu Mentora</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Basándome en tu perfil y objetivos, he identificado mentoras que podrían 
                        ser ideales para tu desarrollo profesional.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">María González</h4>
                          <p className="text-sm text-gray-600">Senior Engineering Manager @ Google</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Especialista en liderazgo técnico y gestión de equipos
                          </p>
                          <Button size="sm" className="mt-2">Ver Perfil</Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold">Ana Ruiz</h4>
                          <p className="text-sm text-gray-600">VP of Engineering @ Spotify</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Experta en escalamiento de equipos y cultura organizacional
                          </p>
                          <Button size="sm" className="mt-2">Ver Perfil</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sesiones Programadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Aún no tienes sesiones de mentoría programadas. Una vez que conectes 
                        con una mentora, podrás programar sesiones aquí.
                      </p>
                      
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-semibold text-blue-800 mb-1">
                          ¡Comienza tu journey de mentoría!
                        </h4>
                        <p className="text-sm text-blue-600 mb-3">
                          Las mujeres con mentoras tienen 2x más probabilidad de ser promovidas
                        </p>
                        <Button>Explorar Mentoras</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}