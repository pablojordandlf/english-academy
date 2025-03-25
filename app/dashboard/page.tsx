"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import SubscriptionBanner from "@/components/SubscriptionBanner";

interface DashboardProps {
  user: any;
  userInterviews: any[];
  allInterview: any[];
}

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [userInterviews, setUserInterviews] = useState<any[]>([]);
  const [allInterview, setAllInterview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userAccess, handleAccessAttempt } = useAccessControl();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        
        if (!userData.user) {
          router.push('/sign-in');
          return;
        }
        
        setUserData(userData.user);
        
        // Obtener entrevistas del usuario
        const interviewsResponse = await fetch(`/api/interviews/user?userId=${userData.user.id}`);
        const interviewsData = await interviewsResponse.json();
        setUserInterviews(interviewsData.interviews || []);
        
        // Obtener últimas entrevistas
        const latestResponse = await fetch(`/api/interviews/latest?userId=${userData.user.id}`);
        const latestData = await latestResponse.json();
        setAllInterview(latestData.interviews || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleStartClass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (handleAccessAttempt()) {
      router.push('/dashboard/interview');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = allInterview?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <SubscriptionBanner className="fixed top-4 right-4" />
          <div className="inline-block rounded-full bg-gray-800/80 backdrop-blur-sm px-4 py-1.5 mb-2">
            <span className="text-gray-300">Bienvenido</span>
            <span className="text-primary-300 ml-1">{userData?.name}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Mejora tu inglés con práctica y retroalimentación en tiempo real
          </h2>
          
          <p className="text-lg text-gray-300">
            Practica conversaciones reales en inglés con nuestro profesor de IA y recibe retroalimentación detallada instantáneamente.
          </p>

          <div className="flex flex-wrap gap-4">
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
              Iniciar nueva clase
              {!userAccess.canAccessClasses && userAccess.subscriptionStatus === 'expired' && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md">
                  Expirado
                </span>
              )}
            </Button>
            
            <Button asChild variant="outline" className="border-gray-700 hover:border-primary-500 text-gray-300 hover:text-primary-300">
              <Link href="/dashboard/progress" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ver mi progreso
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full lg:w-2/5 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl -z-10" />
          <div className="absolute inset-y-0 inset-x-4 bg-gray-900/50 backdrop-blur-sm rounded-xl -z-5 transform rotate-3"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/avatar.png"
              alt="AI English Teacher"
              width={380}
              height={380}
              className="object-contain rounded-xl"
              priority
            />
          </div>
          
          {/* Stats floating card */}
          <div className="absolute -bottom-4 -right-4 bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-primary-500/20">
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
              </div>
              <span className="text-sm font-medium">Aprendizaje personalizado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Tus clases recientes</h2>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={userData?.id}
                interviewId={interview.id}
                level={interview.level}
                type={interview.type}
                topic={interview.topic}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
              <h3 className="text-xl font-medium mb-3 text-primary-300">
                Aún no has tomado ninguna clase
              </h3>
              <p className="text-gray-300 mb-6">
                ¡Comienza tu viaje hacia la fluidez en inglés hoy mismo!
              </p>
              <Button 
                onClick={handleStartClass}
                className={cn(
                  "btn-primary mx-auto relative overflow-hidden",
                  !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700"
                )}
                disabled={!userAccess.canAccessClasses}
              >
                {!userAccess.canAccessClasses && (
                  <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                )}
                Tomar tu primera clase
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-16 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">Mejora tus habilidades con práctica regular</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Los usuarios que practican al menos 3-4 veces por semana durante 20-30 minutos ven mejoras significativas en su fluidez.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1 text-white">Conversación natural</h3>
            <p className="text-sm text-center text-gray-400">Practica con nuestro profesor AI que se adapta a tu nivel</p>
          </div>
          
          <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1 text-white">Retroalimentación instantánea</h3>
            <p className="text-sm text-center text-gray-400">Recibe correcciones y consejos durante la conversación</p>
          </div>
          
          <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-lg">
            <div className="rounded-full bg-primary-500/20 p-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1 text-white">Seguimiento del progreso</h3>
            <p className="text-sm text-center text-gray-400 mb-3">Monitorea tu mejora con análisis detallado</p>
            <Button asChild variant="outline" size="sm" className="mt-auto border-gray-700 hover:border-primary-500 text-gray-300 hover:text-primary-300">
              <Link href="/dashboard/progress">Ver mi progreso</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}