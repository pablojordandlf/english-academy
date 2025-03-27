"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getAllFeedbackByUserId, getAllInterviewsByUserId } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  level: string;
  type: string;
  createdAt: string;
}

interface FeedbackWithDetails extends Feedback {
  level: string;
  type: string;
  date: Date;
  createdAt: string;
}

interface SkillProgress {
  name: string;
  scores: number[];
  average: number;
  improvement: number;
}

interface ProgressStats {
  totalClasses: number;
  averageScore: number;
  bestScore: number;
  improvementRate: number;
  classesByLevel: Record<string, number>;
  classesByType: Record<string, number>;
  recentScores: {date: string, score: number}[];
  skillProgress: SkillProgress[];
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const { userAccess, handleAccessAttempt } = useAccessControl();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return redirect("/auth/sign-in");
        }
        setUser(currentUser);

        // Obtener todas las evaluaciones del usuario
        const allFeedback = await getAllFeedbackByUserId(currentUser.id);
        console.log("Feedback obtenido:", allFeedback);
        
        const interviews = await getAllInterviewsByUserId(currentUser.id) || [];
        console.log("Entrevistas obtenidas:", interviews);

        if (!allFeedback || allFeedback.length === 0) {
          setStats({
            totalClasses: 0,
            averageScore: 0,
            bestScore: 0,
            improvementRate: 0,
            classesByLevel: {},
            classesByType: {},
            recentScores: [],
            skillProgress: []
          });
          setIsLoading(false);
          return;
        }

        // Combinar feedback con detalles de entrevista
        const feedbackWithDetails: FeedbackWithDetails[] = allFeedback.map((feedback: Feedback) => {
          const interview = interviews.find(i => i.id === feedback.interviewId);
          // Manejar el posible timestamp de Firestore
          let createdAt = feedback.createdAt;
          if (typeof createdAt === 'object' && createdAt !== null && 'toDate' in createdAt) {
            // Es un timestamp de Firestore
            createdAt = (createdAt as any).toDate().toISOString();
          } else if (typeof createdAt !== 'string') {
            // Por si acaso no es un string ni un timestamp
            createdAt = new Date().toISOString();
          }
          
          return {
            ...feedback,
            level: interview?.level || "Desconocido",
            type: interview?.type || "Desconocido",
            createdAt,
            date: new Date(createdAt)
          };
        });
        
        // Ordenar por fecha
        feedbackWithDetails.sort((a: FeedbackWithDetails, b: FeedbackWithDetails) => a.date.getTime() - b.date.getTime());
        console.log("Feedback procesado:", feedbackWithDetails);

        // Calcular estadísticas
        const totalClasses = feedbackWithDetails.length;
        const scores = feedbackWithDetails.map(f => f.totalScore);
        const averageScore = scores.length > 0 
          ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / totalClasses) 
          : 0;
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

        // Calcular tasa de mejora (comparar primeras vs últimas clases)
        let improvementRate = 0;
        if (feedbackWithDetails.length >= 3) {
          const firstThird = feedbackWithDetails.slice(0, Math.ceil(totalClasses / 3));
          const lastThird = feedbackWithDetails.slice(-Math.ceil(totalClasses / 3));
          const firstAvg = firstThird.reduce((sum: number, f: FeedbackWithDetails) => sum + f.totalScore, 0) / firstThird.length;
          const lastAvg = lastThird.reduce((sum: number, f: FeedbackWithDetails) => sum + f.totalScore, 0) / lastThird.length;
          improvementRate = firstAvg > 0 ? Math.round(((lastAvg - firstAvg) / firstAvg) * 100) : 0;
        }

        // Clases por nivel y tipo
        const classesByLevel: Record<string, number> = {};
        const classesByType: Record<string, number> = {};

        feedbackWithDetails.forEach(f => {
          classesByLevel[f.level] = (classesByLevel[f.level] || 0) + 1;
          classesByType[f.type] = (classesByType[f.type] || 0) + 1;
        });

        // Obtener las puntuaciones recientes (últimas 10)
        const recentScores = feedbackWithDetails
          .slice(-10)
          .map(f => ({
            date: new Date(f.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short'
            }), 
            score: f.totalScore
          }));

        // Calcular progreso por habilidad
        const skillCategories: Record<string, number[]> = {};
        
        feedbackWithDetails.forEach(feedback => {
          if (feedback.categoryScores && Array.isArray(feedback.categoryScores)) {
            feedback.categoryScores.forEach(category => {
              if (!skillCategories[category.name]) {
                skillCategories[category.name] = [];
              }
              skillCategories[category.name].push(category.score);
            });
          }
        });

        const skillProgress: SkillProgress[] = Object.entries(skillCategories).map(([name, scores]) => {
          const average = scores.length > 0 
            ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length)
            : 0;
          
          let improvement = 0;
          if (scores.length >= 2) {
            const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
            const secondHalf = scores.slice(-Math.ceil(scores.length / 2));
            const firstAvg = firstHalf.reduce((sum: number, score: number) => sum + score, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum: number, score: number) => sum + score, 0) / secondHalf.length;
            improvement = firstAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) : 0;
          }

          return {
            name,
            scores,
            average,
            improvement
          };
        });

        console.log("Estadísticas calculadas:", {
          totalClasses,
          averageScore,
          bestScore,
          improvementRate,
          classesByLevel,
          classesByType,
          recentScores,
          skillProgress
        });

        setStats({
          totalClasses,
          averageScore,
          bestScore,
          improvementRate,
          classesByLevel,
          classesByType,
          recentScores,
          skillProgress
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartClass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (handleAccessAttempt()) {
      router.push('/dashboard/interview');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Cargando tus estadísticas...</p>
        </div>
      </div>
    );
  }

  // Si no hay clases completadas
  if (stats && stats.totalClasses === 0) {
    return (
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg mb-8 text-center">
        <div className="rounded-full bg-primary-500/20 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          ¡Comienza tu viaje hacia la fluidez!
        </h1>
        
        <p className="text-gray-300 max-w-lg mx-auto mb-8">
          Aún no has completado ninguna clase. Toma tu primera clase para comenzar a ver estadísticas de tu progreso y mejorar tus habilidades en inglés.
        </p>
        
        <Button asChild className="btn-primary">
          <Link href="/dashboard/interview">
            Iniciar tu primera clase
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg mb-4">
        <div className="text-center mb-8">
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-2">
            <span className="text-primary-300 text-sm font-medium">TU PROGRESO</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Análisis de tu aprendizaje
          </h1>
          
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Monitoriza tu evolución en inglés, identifica fortalezas y áreas de mejora
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/60 p-6 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 w-14 h-14 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-1">Clases Completadas</h3>
            <p className="text-4xl font-bold text-primary-300">{stats?.totalClasses}</p>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 w-14 h-14 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-1">Puntuación Media</h3>
            <p className="text-4xl font-bold text-primary-300">{stats?.averageScore}</p>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 w-14 h-14 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-1">Mejor Puntuación</h3>
            <p className="text-4xl font-bold text-primary-300">{stats?.bestScore}</p>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 w-14 h-14 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-1">Progreso</h3>
            <div className="flex items-end gap-1">
              <p className="text-4xl font-bold text-primary-300">
                {stats && typeof stats.improvementRate === 'number' && stats.improvementRate > 0 ? "+" : ""}
                {stats?.improvementRate ?? 0}%
              </p>
              <span className="text-gray-400 text-sm pb-1">desde tu inicio</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 p-6 rounded-xl lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-white">Evolución de tus puntuaciones</h3>
            
            {stats?.recentScores && stats.recentScores.length > 1 ? (
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {stats.recentScores.map((data, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full flex justify-center mb-2">
                      <span className="text-sm text-primary-300 font-medium">{data.score}</span>
                    </div>
                    <div 
                      className="w-12 bg-gradient-to-t from-primary-700 to-primary-500 rounded-t-md"
                      style={{ height: `${(data.score / 100) * 200}px` }}
                    ></div>
                    <div className="w-full mt-2 text-center">
                      <span className="text-xs text-gray-400">{data.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                Completa más clases para ver la evolución de tus puntuaciones
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Distribución por Nivel</h3>
            
            {Object.keys(stats?.classesByLevel || {}).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats?.classesByLevel || {}).map(([level, count], index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 capitalize">{level}</span>
                      <span className="text-primary-300 font-medium">{count} {count === 1 ? 'clase' : 'clases'}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                        style={{ width: `${(count / stats!.totalClasses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                No hay datos disponibles
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-6 text-white">Progreso por Habilidades</h3>
          
          {stats?.skillProgress && stats.skillProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.skillProgress.map((skill, index) => (
                <div key={index} className="bg-gray-900/40 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">{skill.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-primary-300 font-bold">{skill.average}</span>
                      <div className={`flex items-center ${skill.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d={skill.improvement > 0 
                              ? "M5 15l7-7 7 7" 
                              : "M19 9l-7 7-7-7"} 
                          />
                        </svg>
                        <span className="text-xs">{skill.improvement > 0 ? "+" : ""}{skill.improvement}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full mb-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                      style={{ width: `${skill.average}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">Basado en {skill.scores.length} evaluaciones</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              Completa más clases para obtener análisis detallados por habilidades
            </div>
          )}
        </div>

        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary-500/20 p-2 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-primary-300 mb-1">Recomendaciones para seguir mejorando</h4>
              <p className="text-sm text-gray-300 mb-4">
                En base a tu desempeño, te recomendamos concentrarte en las siguientes áreas:
              </p>
              <ul className="space-y-2">
                {stats?.skillProgress && stats.skillProgress.length > 0 ? (
                  stats.skillProgress
                    .sort((a, b) => a.average - b.average)
                    .slice(0, 2)
                    .map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-300 mr-2 text-lg">•</span>
                        <span className="text-gray-300">
                          Practica más tu <strong>{skill.name.toLowerCase()}</strong> - Tu puntuación actual es {skill.average}/100
                        </span>
                      </li>
                    ))
                ) : (
                  <li className="flex items-start">
                    <span className="text-primary-300 mr-2 text-lg">•</span>
                    <span className="text-gray-300">
                      Continúa tomando clases regularmente para obtener recomendaciones personalizadas
                    </span>
                  </li>
                )}
                <li className="flex items-start">
                  <span className="text-primary-300 mr-2 text-lg">•</span>
                  <span className="text-gray-300">
                    Programa al menos 3 sesiones de práctica semanales para mantener un progreso constante
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="btn-secondary">
            <Link href="/dashboard">
              Volver al Dashboard
            </Link>
          </Button>

          <Button 
            onClick={handleStartClass}
            className={cn(
              "btn-primary relative overflow-hidden",
              !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700"
            )}
            disabled={!userAccess.canAccessClasses}
          >
            {!userAccess.canAccessClasses && (
              <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
            )}
            Nueva clase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page; 