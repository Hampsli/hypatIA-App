import {  useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { User, GraduationCap, Briefcase, Heart, Upload } from 'lucide-react';

const profileSchema = z.object({
  // Personal Information
  gender: z.string().min(1, 'Género es requerido'),
  cvFile: z.instanceof(FileList).optional(),
  
  // Educational Information
  initialEducation: z.string().min(1, 'Formación inicial es requerida'),
  higherEducationArea: z.string().optional(),
  technologyLanguage: z.string().optional(),
  
  // Professional Information
  currentPosition: z.string().optional(),
  workHoursPerWeek:z.string().optional(),
  workMode: z.string().optional(),
  salaryRange: z.string().optional(),
  reasonsForMovement: z.array(z.string()).min(1, 'Selecciona al menos una razón'),
  expectedSalary: z.string().min(1, 'Expectativa salarial requerida'),
  hasCompletedCourses: z.string(),
  projectsBuilt: z.number().min(0, 'Número inválido'),

    // Caregiver Information
  CaregiverStatus: z.string(),
  caregivingHoursPerWeek: z.string().optional(),
  
  // Expectations
  lastFeedback: z.string().min(10, 'Proporciona más detalles sobre la retroalimentación'),
  targetJobs: z.array(z.string()).min(1, 'Agrega al menos una vacante'),
  dailyTasks: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfileFormPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [targetJobInputs, setTargetJobInputs] = useState(['', '', '']);
  const [hasJob, setHasJob] = useState(false);
  const [hasCompletedCoursesFlag, setHasCompletedCoursesFlag] = useState(false);

  const UserName = localStorage.getItem('pendingName');


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      CaregiverStatus: "No estoy segura",
      hasCompletedCourses: "false",
      projectsBuilt: 0,
      reasonsForMovement: [],
      currentPosition: "No tiene empleo",
      workHoursPerWeek: "No especificado",
      workMode: "No especificado",
      salaryRange: "No especificado",
      targetJobs: ['', '', ''],
    },
  });

  const CaregiverStatus = watch('CaregiverStatus');
  const initialEducation = watch('initialEducation');

  const sections = [
    'Información Personal',
    'Información Escolar',
    'Información complementaria laboral',
    'Caregiver Information',
    'Expectativas y Desarrollo',
    "Analisis de Retroalimentación"
  ];

  const onSubmit = async (data: ProfileData) => {
    setIsLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/profile/update`;

      const filteredTargetJobs = data.targetJobs.filter(job => job.trim() !== '');
      const hasCompletedCourses = Boolean(data.hasCompletedCourses);
      const profileData = {
        ...data,
        targetJobs: filteredTargetJobs,
        userId: user?.id,
        hasCompletedCourses: hasCompletedCourses,
      };
 
      const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify(profileData), 
    });

     if (response.ok) {
            // --- PASO 2: Si el perfil se guardó, llamar al servicio de IA ---
      if (data.lastFeedback && data.lastFeedback.trim() !== '') {
        try {
          const aiApiUrl = `${import.meta.env.VITE_API_BASE_URL}api/ai/analyze`;
          
          const aiRequestBody = {
            text: data.lastFeedback,
            analysisType: 'SKILLS_GAP', 
          };

          const aiResponse = await fetch(aiApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(aiRequestBody),
          });

          if (aiResponse.ok) {
            console.log('Análisis de IA exitoso');
          } else {
            // Si el análisis falla, lo registramos pero continuamos, ya que el perfil sí se guardó.
            console.error('Falló el análisis de IA, pero el perfil se guardó correctamente.');
          }

        } catch (aiError) {
          console.error('Error de conexión con el servicio de IA:', aiError);
        }
      }
      
        setLocation('/final-screen-demo');
    } else {
       const result = await response.json();
       alert(result.error || 'Error al guardar el perfil');
    }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
      setLocation('/final-screen-demo');
    }
  };

  const handleReasonChange = (reason: string, checked: boolean) => {
    const currentReasons = watch('reasonsForMovement') || [];
    if (checked) {
      setValue('reasonsForMovement', [...currentReasons, reason]);
    } else {
      setValue('reasonsForMovement', currentReasons.filter(r => r !== reason));
    }
  };

  const handleTargetJobChange = (index: number, value: string) => {
    const newTargetJobs = [...targetJobInputs];
    newTargetJobs[index] = value;
    setTargetJobInputs(newTargetJobs);
    setValue('targetJobs', newTargetJobs);
  };


  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center mb-6">
              <div className="text-2xl font-bold hypatia-text-gradient mb-2">hypatIA</div>
              <CardTitle>Perfil de la Participante</CardTitle>
              <p className="text-gray-600">
                ¡Bienvenida {user?.name}! Completa tu perfil para obtener una evaluación personalizada
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                {sections.map((section, index) => (
                  <span key={index} className={`${
                    index === currentSection ? 'text-primary font-medium' : 'text-gray-500'
                  }`}>
                    {index + 1}. {section}
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="hypatia-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Section 0: Personal Information */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Información de Identificación Personal</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre (automático)</Label>
                      <Input value={UserName || ''} disabled className="bg-gray-50" />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender">Género *</Label>
                      <Select {...register('gender')}>
                        <option value="">Seleccionar...</option>
                        <option value="femenino">Femenino</option>
                        <option value="masculino">Masculino</option>
                        <option value="no-binario">No binario</option>
                        <option value="prefiero-no-decir">Prefiero no decir</option>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
                      )}
                    </div>
                  </div>

                  {/* <div>
                    <Label htmlFor="cvFile">Sube tu CV actualizado</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        {...register('cvFile')}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="cv-upload"
                      />
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <span className="text-primary hover:underline">
                          Haz clic para subir tu CV
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF, DOC o DOCX (máximo 5MB)
                        </p>
                      </label>
                    </div>
                  </div> */}
                </div>
              )}

              {/* Section 1: Educational Information */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Información Escolar participante</h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="initialEducation">Ultimo grado de estudios completo: *</Label>
                    <Select {...register('initialEducation')}>
                      <option value="">Seleccionar...</option>
                      <option value="medio-superior">Medio Superior</option>
                      <option value="Profesional-tecnico-terminal">Profesional técnico terminal</option>
                      <option value="superior">Superior</option>
                      <option value="Profesional-tecnico-terminal">Técnico superior universitario y profesional asociado</option>
                      <option value="especializacion">Especialización</option>
                      <option value="maestria">Maestría</option>
                      <option value="doctorado">Doctorado</option>
                    </Select>
                    {errors.initialEducation && (
                      <p className="text-sm text-red-500 mt-1">{errors.initialEducation.message}</p>
                    )}
                  </div>

                  {(initialEducation === 'superior' || 
                    initialEducation === 'especializacion' || 
                    initialEducation === 'maestria' || 
                    initialEducation === 'doctorado') && (
                    <div>
                      <Label htmlFor="higherEducationArea">¿En qué área es tu formación Superior?</Label>
                     <Select {...register('higherEducationArea')}>
                      <option value="">Seleccionar...</option>
                      <option value="Educación">Educación</option>
                      <option value="Artes-y-humanidades">Artes y humanidades</option>
                      <option value="Ciencias-Sociales-Administración-y-Derecho">Ciencias Sociales, Administración y Derecho</option>
                      <option value="Ciencias-Naturales-o-Exactas">Ciencias Naturales o Exactas</option>
                      <option value="Ciencias-de-la-Computación">Ciencias de la Computación</option>
                      <option value="Ingeniería-Manufactura-y-Construcción">Ingeniería, Manufactura y Construcción</option>
                      <option value="Agronomía-y-veterinaria">Agronomía y veterinaria</option>
                      <option value="Salud">Salud</option>
                      <option value="Servicios">Servicios</option>
                    </Select>
                    </div>
                  )}

                {(initialEducation === 'medio-superior' || 
                  initialEducation === 'Profesional-tecnico-terminal'
                ) && (
                  <div>
                    <Label htmlFor="technologyLanguage">¿Qué "Tecnología-Lenguaje" desarrollas?</Label>
                     <Select  {...register('technologyLanguage')}>
                      <option value="">Seleccionar...</option>
                      <option value="Java">Java</option>
                      <option value="Python">Python</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="C++">C++</option>
                      <option value="Swift">Swift</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="PHP">PHP</option>
                      <option value="C#">C#</option>
                    </Select>
                  </div>
                )}
                </div>
              )}
            {/* Section 2: Professional Information */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Información complementaria laboral</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                      <Label htmlFor="hasJob">¿Actualmente te encuentras trabajando?</Label>
                      <Select onChange={(e) => setHasJob(e.target.value === "true")}>
                        <option value="">Seleccionar...</option>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                      </Select>
                      
                      {/* {errors.yearsOfExperience && (
                        <p className="text-sm text-red-500 mt-1">{errors.yearsOfExperience.message}</p>
                      )} */}
                    </div>
                    {hasJob !== false &&  <div>
                      <Label htmlFor="workHoursPerWeek">¿Cuántas horas destinas trabajas a la semana?</Label>
                      <Select {...register('workHoursPerWeek')}>
                        <option value="">Seleccionar...</option>
                        <option value="Tiempo-completo">Tiempo completo: 40 a más horas</option>
                        <option value="Medio-tiempo">Medio tiempo: 20 horas o menos</option>
                        <option value="Por-proyecto">Por proyecto</option>
                      </Select>
                      {/* {errors.yearsOfExperience && (
                        <p className="text-sm text-red-500 mt-1">{errors.yearsOfExperience.message}</p>
                      )} */}
                    </div>  }
                    {/* <div>
                      <Label htmlFor="yearsOfExperience">Años de experiencia en el área TECH *</Label>
                      <Select {...register('yearsOfExperience')}>
                        <option value="">Seleccionar...</option>
                        <option value="0-1">0-1 años</option>
                        <option value="2-3">2-3 años</option>
                        <option value="4-5">4-5 años</option>
                        <option value="6-10">6-10 años</option>
                        <option value="mas-10">Más de 10 años</option>
                      </Select>
                      {errors.yearsOfExperience && (
                        <p className="text-sm text-red-500 mt-1">{errors.yearsOfExperience.message}</p>
                      )}
                    </div> */}
                      {hasJob &&  
                    <div>
                      <Label htmlFor="workMode">Modalidad de trabajo *</Label>
                      <Select {...register('workMode')}>
                        <option value="">Seleccionar...</option>
                        <option value="presencial">Presencial</option>
                        <option value="remoto">Remoto</option>
                        <option value="hibrido">Híbrido</option>
                      </Select>
                      {errors.workMode && (
                        <p className="text-sm text-red-500 mt-1">{errors.workMode.message}</p>
                      )}
                    </div>}
                  </div>
                   {/* <div>
                      <Label htmlFor="startedInTech">¿Cuándo comenzaste a trabajar en el área tech? *</Label>
                      <Input
                        {...register('startedInTech')}
                        type="date"
                      />
                      {errors.startedInTech && (
                        <p className="text-sm text-red-500 mt-1">{errors.startedInTech.message}</p>
                      )}
                    </div> */}
                 

                  <div className="grid grid-cols-2 gap-4">
                  {hasJob  &&  <><div>
                      <Label htmlFor="currentPosition">¿Qué posición tienes actualmente? *</Label>
                      <Select {...register('currentPosition')}>
                        <option value="">Seleccionar...</option>
                        <option value="Desarrollador">Desarrollador frontend/Backend/Aplicaciones móviles/FullStack</option>
                        <option value="IngenieraSoftware/Ciberseguridad">Ingeniera Sofware/Cibrseguridad</option>
                        <option value="Analista">Analista de data/Administradora de bases de datos</option>
                        <option value="Diseñadora">Diseñadora UX/UI</option>
                        <option value="TeamLead">Lider de equipo/Team leader</option>
                        <option value="ProjectManager">Project manager</option>
                        <option value="Scrum-master">Scrum master</option>
                      </Select>
                      {errors.currentPosition && (
                        <p className="text-sm text-red-500 mt-1">{errors.currentPosition.message}</p>
                      )}
                    </div><div>
                        <Label htmlFor="salaryRange">Rango salarial actual *</Label>
                        <Select {...register('salaryRange')}>
                          <option value="">Seleccionar...</option>
                          <option value="menos-20k">Menos de $20,000 MXN</option>
                          <option value="20k-30k">$20,000 - $30,000 MXN</option>
                          <option value="30k-50k">$30,000 - $50,000 MXN</option>
                          <option value="50k-80k">$50,000 - $80,000 MXN</option>
                          <option value="mas-80k">Más de $80,000 MXN</option>
                        </Select>
                        {errors.salaryRange && (
                          <p className="text-sm text-red-500 mt-1">{errors.salaryRange.message}</p>
                        )}
                      </div></>
                    }
                  </div>

                  <div>
                    <Label>Razones por las cuales buscas movimiento profesional *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Crecimiento laboral', 'Mayor salario', 'Desarrollo de habilidades', 'Mejor ambiente laboral', 'Otra'].map((reason) => (
                        <label key={reason} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={(e) => handleReasonChange(reason, e.target.checked)}
                          />
                          {reason}
                        </label>
                      ))}
                    </div>
                    {errors.reasonsForMovement && (
                      <p className="text-sm text-red-500 mt-1">{errors.reasonsForMovement.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="expectedSalary">Al cambiarte de empleo, esperarías ganar en promedio cuánto más de lo que percibes actualmente, por mes: *</Label>
                    <Select {...register('expectedSalary')}>
                      <option value="">Seleccionar...</option>
                      <option value="3k-5k">Entre 3 a 5 mil</option>
                      <option value="6k-10k">Entre 6 a 10 mil</option>
                      <option value="11k-17k">De 11 a 17 mil</option>
                    </Select>
                    {errors.expectedSalary && (
                      <p className="text-sm text-red-500 mt-1">{errors.expectedSalary.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>¿En los últimos seis meses has completado cursos, diplomados o talleres?</Label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          {...register('hasCompletedCourses')}
                          type="radio"
                          value="true"
                          className="mr-2"
                          onChange={(e) => setHasCompletedCoursesFlag(Boolean(e.target.value) )}
                        />
                        Sí
                      </label>
                      <label className="flex items-center">
                        <input
                          {...register('hasCompletedCourses')}
                          type="radio"
                          value="false"
                          className="mr-2"
                          onChange={(e) => setHasCompletedCoursesFlag(Boolean(!e.target.value) )}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {hasCompletedCoursesFlag && (
                    <div>
                      <Label htmlFor="projectsBuilt">¿Cuántos proyectos has construido con estos cursos?</Label>
                      <Input
                        {...register('projectsBuilt', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        placeholder="0"
                      />
                      {errors.projectsBuilt && (
                        <p className="text-sm text-red-500 mt-1">{errors.projectsBuilt.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Section 3: Caregiver Information */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Información Relacionada con los eventos que afectan directamente a mujeres</h3>
                  </div>
                  
                  <div>
                    <Label>¿Actualmente, ejerces o participas en tareas de cuidado? (de forma directa o indirecta) *</Label>
                      <Select {...register('CaregiverStatus')}>
                        <option value="">Seleccionar...</option>
                        <option value="Directa">Directa</option>
                        <option value="Indirecta">Indirecta</option>
                        <option value="No-estoy segura">No, estoy segura</option>
                        <option value="No-participo">No participo</option>
                      </Select>
                  </div>

                  {(CaregiverStatus === "Directa" ||
                  CaregiverStatus === "Indirecta" ||
                  CaregiverStatus === "No-estoy-segura")
                   && (
                    <div>
                      <Label htmlFor="caregivingHoursPerWeek">¿Cuánto tiempo dedicas a ello por semana? (O podrías colocar un aproximado de tu tiempo al día en porcentaje)</Label>
                      <Select {...register('caregivingHoursPerWeek')}>
                        <option value="">Seleccionar...</option>
                        <option value="40h">40 horas a la semana</option>
                        <option value="20h">20 horas a la semana</option>
                        <option value="10h">10 horas a la semana</option>
                      </Select>
                    </div>
                  )}
                </div>
              )}
              {/* Section 4: Expectations */}
              {currentSection === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Expectativas y Desarrollo</h3>
                  </div>    
                  <div>
                    <Label>Coloca tres vacantes a las que te gustaría aplicar en este momento</Label>
                    {targetJobInputs.map((job, index) => (
                      <div key={index} className="mt-2">
                        <Input
                          value={job}
                          onChange={(e) => handleTargetJobChange(index, e.target.value)}
                          placeholder={`Vacante ${index + 1}...`}
                        />
                      </div>
                    ))}
                    {errors.targetJobs && (
                      <p className="text-sm text-red-500 mt-1">{errors.targetJobs.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dailyTasks">
                     Enlista un máximo de cinco laborales diarias de manera general (Administrativas y  de desarrollo) *
                    </Label>
                    <Textarea
                      {...register('dailyTasks')}
                      placeholder="Describe tus actividades diarias..."
                      rows={4}
                    />
                    {errors.dailyTasks && (
                      <p className="text-sm text-red-500 mt-1">{errors.dailyTasks.message}</p>
                    )}
                  </div>
                </div>
              )}
              {/* Section 5: Feedback*/}
              {currentSection === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Analisis de Retroalimentación</h3>
                  </div>
                  
                  <div>
                    <Label htmlFor="lastFeedback">
                      Comparte la última retroalimentación que algún superior, colega o alguien de RH 
                      te brindó respecto a habilidades NO técnicas *
                    </Label>
                    <Textarea
                      {...register('lastFeedback')}
                      placeholder="Sé lo más extensa y descriptiva posible..."
                      rows={4}
                    />
                    {errors.lastFeedback && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastFeedback.message}</p>
                    )}
                  </div>

                </div>
              )}


              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  disabled={currentSection === 0}
                >
                  Anterior
                </Button>

                {currentSection < sections.length - 1 ? (
                  <Button type="button" onClick={nextSection}>
                    Siguiente
                  </Button>
                ) : (
                  <Button type="submit" >
                    {isLoading ? 'Guardando...' : 'Continuar a Evaluación'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}