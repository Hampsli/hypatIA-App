import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { AssessmentQuestion } from '@shared/schema';

export default function AssessmentPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const queryClient = useQueryClient();

  // Debug: Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 Assessment page - Token:', token ? 'Present' : 'Missing');
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      setLocation('/login');
      return;
    }
  }, [setLocation]);

  const { data: questions, isLoading, error } = useQuery<AssessmentQuestion[]>({
    queryKey: ['/api/assessment/questions'],
    retry: 1,
  });

  // Debug: Log query status
  useEffect(() => {
    console.log('📊 Assessment questions query status:', { 
      isLoading, 
      hasQuestions: !!questions, 
      questionsCount: questions?.length,
      error: error?.message 
    });
  }, [isLoading, questions, error]);

  const submitResponsesMutation = useMutation({
    mutationFn: async (responses: Array<{ questionId: number; selectedOption: string }>) => {
      const response = await fetch('/api/assessment/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit responses');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/responses'] });
      setLocation('/dashboard');
    },
  });

  const handleAnswerSelect = (questionId: number, answer: string) => {
    console.log('📝 Answer selected', { questionId, answer });
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    console.log('🔄 Next question clicked', { currentQuestion, totalQuestions: questions?.length });
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log('✅ Moved to question', currentQuestion + 1);
    } else {
      console.log('⚠️ Cannot move to next question');
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!questions) return;

    const responses = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId),
      selectedOption,
    }));

    if (responses.length === questions.length) {
      submitResponsesMutation.mutate(responses);
    } else {
      alert('Por favor responde todas las preguntas antes de continuar.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">Error al cargar las preguntas:</p>
            <p className="text-sm text-gray-600 mb-4">{error.message}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Reintentar
              </Button>
              <Button variant="outline" onClick={() => setLocation('/dashboard')} className="w-full">
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p>No hay preguntas disponibles en este momento.</p>
            <div className="space-y-2 mt-4">
              <Button onClick={() => window.location.reload()} className="w-full">
                Reintentar
              </Button>
              <Button variant="outline" onClick={() => setLocation('/dashboard')} className="w-full">
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center mb-6">
              <div className="text-2xl font-bold hypatia-text-gradient mb-2">hypatIA</div>
              <CardTitle>Evaluación de Power Skills</CardTitle>
              <p className="text-gray-600">
                Responde con honestidad para obtener una evaluación precisa de tus habilidades
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-primary font-medium">
                  {Math.round(progress)}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="hypatia-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Question */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 leading-relaxed">
                  {currentQuestionData.question}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="grid gap-3 max-w-2xl mx-auto">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestionData.id, option)}
                    className={`p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                      answers[currentQuestionData.id] === option
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {answers[currentQuestionData.id] === option && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Question Status */}
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-6">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === currentQuestion
                          ? 'bg-primary'
                          : answers[questions[index].id]
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <div className="text-center">
                  {isLastQuestion && allQuestionsAnswered && (
                    <p className="text-green-600 text-sm font-medium mb-2">
                      ¡Todas las preguntas respondidas!
                    </p>
                  )}
                </div>

                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered || submitResponsesMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitResponsesMutation.isPending ? 'Enviando...' : 'Finalizar Evaluación'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      console.log('🟡 Button clicked - Next Question');
                      console.log('📊 Current state:', {
                        currentQuestion,
                        hasAnswer: !!answers[currentQuestionData.id],
                        answer: answers[currentQuestionData.id],
                        questionsLength: questions?.length
                      });
                      nextQuestion();
                    }}
                    disabled={!answers[currentQuestionData.id]}
                    className={!answers[currentQuestionData.id] ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>

              {/* Helper text */}
              <div className="text-center text-sm text-gray-500 pt-4">
                <p>
                  Selecciona una opción para continuar. Puedes volver atrás para modificar tus respuestas.
                </p>
                {!answers[currentQuestionData.id] && (
                  <p className="text-amber-600 mt-2 font-medium">
                    ⚠️ Debes seleccionar una respuesta para continuar
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}