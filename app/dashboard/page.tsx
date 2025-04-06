"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

import { Button } from "@/components/ui/button";
import ClientInterviewCard from "@/components/ClientInterviewCard";
import GeneralClassCard from "@/components/GeneralClassCard";
import { useAccessControl } from "@/hooks/useAccessControl";
import { ArrowRight, BarChart, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import SubscriptionBanner from "@/components/SubscriptionBanner";
import PronunciationClassCard from "@/components/PronunciationClassCard";
interface DashboardProps {
  user: any;
  userInterviews: any[];
  allInterview: any[];
}

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [userInterviews, setUserInterviews] = useState<any[]>([]);
  const [generalClasses, setGeneralClasses] = useState<any[]>([]);
  const [pronunciationClasses, setPronunciationClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userAccess, handleAccessAttempt } = useAccessControl();
  const router = useRouter();

  const dashboardNavLinks = [
    { name: "Inicio", href: "/dashboard" },
    { name: "Clases", href: "/dashboard/interviews" },
    { name: "Progreso", href: "/dashboard/progress" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/auth/me');
        const userData = await userResponse.json();
        
        if (!userData.user) {
          router.push('/sign-in');
          return;
        }
        
        setUserData(userData.user);
        
        const interviewsResponse = await fetch(`/api/interviews/user?userId=${userData.user.id}`);
        const interviewsData = await interviewsResponse.json();
        
        if (interviewsData && interviewsData.interviews) {
          setUserInterviews(interviewsData.interviews);
        } else {
          setUserInterviews([]);
        }
        
        const generalClassesResponse = await fetch('/api/general-class');
        const generalClassesData = await generalClassesResponse.json();
        
        if (generalClassesData && generalClassesData.interviews) {
          setGeneralClasses(generalClassesData.interviews);
        } else {
          setGeneralClasses([]);
        }

        const pronunciationClassesResponse = await fetch(`/api/pronunciation?userId=${userData.user.id}`);
        const pronunciationClassesData = await pronunciationClassesResponse.json();

        if (pronunciationClassesData && pronunciationClassesData.interviews) {
          setPronunciationClasses(pronunciationClassesData.interviews);
        } else {
          setPronunciationClasses([]);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos. Por favor, inténtalo de nuevo.");
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
          <p className="text-gray-300">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = generalClasses?.length > 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header isDashboard={true} navLinks={dashboardNavLinks} userData={userData} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SubscriptionBanner className="md:top-22 md:right-8 md:left-auto md:w-[350px] md:fixed" />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-300 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                ¡Bienvenido de vuelta, {userData?.name}!
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Mejora tu inglés practicando con Gabby
              </h1>
              
              <p className="text-base sm:text-lg text-gray-300 mb-8">
                Primero, crea la clase para definir tu nivel y el tema de la conversación.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleStartClass}
                  className={cn(
                    "btn-primary relative overflow-hidden group",
                    !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700"
                  )}
                  disabled={!userAccess.canAccessClasses}
                >
                  {!userAccess.canAccessClasses && (
                    <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                  )}
                  Crear nueva clase
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  {!userAccess.canAccessClasses && userAccess.subscriptionStatus === 'expired' && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md">
                      Expirado
                    </span>
                  )}
                </Button>
                
                <Button asChild variant="outline" className="border-gray-700 hover:border-primary-500 text-gray-300 hover:text-primary-300">
                  <Link href="/dashboard/progress" className="flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    Ver mi progreso
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative w-full md:w-1/3 aspect-square">
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
            </div>
          </div>
        </section>

        {/* Recent Interviews Section */}
        <section className="mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Tus clases recientes</h2>
              <Button asChild variant="ghost" className="text-primary-300 hover:text-primary-400">
                <Link href="/dashboard/interviews" className="flex items-center gap-2">
                  Ver todas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <p className="text-gray-400 text-sm">Aquí puedes ver todas las clases que has creado</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {hasPastInterviews ? (
              userInterviews.slice(0, 3).map((interview) => (
                <ClientInterviewCard
                  key={interview.id}
                  userId={userData?.id}
                  interviewId={interview.id}
                  level={interview.level}
                  type={interview.type}
                  topic={interview.topic}
                  duration={interview.duration}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700 text-center">
                <h3 className="text-lg sm:text-xl font-medium mb-3 text-primary-300">
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
                  recibir tu primera clase
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* General Classes Section */}
        <section className="mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Clases generales</h2>
              <Button asChild variant="ghost" className="text-primary-300 hover:text-primary-400">
                <Link href="/dashboard/general-classes" className="flex items-center gap-2">
                  Ver todas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <p className="text-gray-400 text-sm">Explora nuestras clases generales disponibles</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {generalClasses.length > 0 ? (
              generalClasses.slice(0, 3).map((interview) => (
                <GeneralClassCard
                  key={interview.id}
                  userId={userData?.id}
                  interviewId={interview.id}
                  level={interview.level}
                  type={interview.type}
                  topic={interview.topic}
                  duration={interview.duration}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700 text-center">
                <h3 className="text-lg sm:text-xl font-medium mb-3 text-primary-300">
                  No hay clases generales disponibles
                </h3>
                <p className="text-gray-300 mb-6">
                  ¡Vuelve pronto para ver nuevas clases generales!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pronunciation Section */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-0">
                Clases de pronunciación
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              Esta clase de pronunciación la hemos generado basándonos en las clases que
              has tenido y áreas de mejora que hemos detectado.
            </p>
            <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/vapi/generate-pronunciation', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        userid: userData?.id,
                        duration: "30",
                      }),
                    });

                    if (response.ok) {
                      toast.success("Clase de pronunciación creada con éxito");
                      // Recargar las clases de pronunciación
                      const pronunciationClassesResponse = await fetch(
                        `/api/pronunciation?userId=${userData?.id}`
                      );
                      const pronunciationClassesData =
                        await pronunciationClassesResponse.json();
                      if (
                        pronunciationClassesData &&
                        pronunciationClassesData.interviews
                      ) {
                        setPronunciationClasses(pronunciationClassesData.interviews);
                      }
                    } else {
                      toast.error("Error al crear la clase de pronunciación");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    toast.error("Error al crear la clase de pronunciación");
                  }
                }}
                className="btn-primary w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-300 transition-all"
                aria-label="Crear clase de pronunciación"
              >
                Crear clase de pronunciación
              </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pronunciationClasses.length > 0 ? (
              pronunciationClasses.slice(0, 3).map((interview) => (
                <PronunciationClassCard
                  key={interview.id}
                  userId={userData?.id}
                  interviewId={interview.id}
                  level={interview.level}
                  type={interview.type}
                  topic={interview.topic}
                  duration={interview.duration}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <div className="col-span-full bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700 text-center">
                <h3 className="text-lg sm:text-xl font-medium mb-3 text-primary-300">
                  No hay clases de pronunciación disponibles
                </h3>
                <p className="text-gray-300 mb-6">
                  ¡Vuelve pronto para ver nuevas clases de pronunciación!
                </p>
              </div>
            )}
          </div>
        </section>


        {/* Tips Section */}
        <section className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">Mejora tus habilidades con práctica regular</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Los usuarios que practican al menos 3-4 veces por semana durante 20-30 minutos ven mejoras significativas en su fluidez.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-xl group hover:bg-gray-900/80 transition-all duration-300">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3 group-hover:bg-primary-500/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1 text-white">Conversación natural</h3>
              <p className="text-sm text-center text-gray-400">Practica con nuestro profesor AI que se adapta a tu nivel</p>
            </div>
            
            <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-xl group hover:bg-gray-900/80 transition-all duration-300">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3 group-hover:bg-primary-500/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg text-center font-medium mb-1 text-white">Retroalimentación instantánea</h3>
              <p className="text-sm text-center text-gray-400">Recibe correcciones y consejos durante la conversación</p>
            </div>
            
            <div className="flex flex-col items-center p-5 bg-gray-900/50 rounded-xl group hover:bg-gray-900/80 transition-all duration-300">
              <div className="rounded-full bg-primary-500/20 p-3 mb-3 group-hover:bg-primary-500/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1 text-white">Seguimiento de progreso</h3>
              <p className="text-sm text-center text-gray-400">Visualiza tu evolución y mejora continua</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}