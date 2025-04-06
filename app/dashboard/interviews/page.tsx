"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Header from "@/components/layout/Header";
import ClientInterviewCard from "@/components/ClientInterviewCard";
import { Button } from "@/components/ui/button";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Lock } from "lucide-react";
import SubscriptionBanner from "@/components/SubscriptionBanner";

export default function InterviewsPage() {
  const [userData, setUserData] = useState<any>(null);
  const [userInterviews, setUserInterviews] = useState<any[]>([]);
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
        
        if (interviewsData && interviewsData.interviews) {
          setUserInterviews(interviewsData.interviews);
        } else {
          setUserInterviews([]);
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
          <p className="text-gray-300">Cargando tus clases...</p>
        </div>
      </div>
    );
  }

  const hasPastInterviews = userInterviews?.length > 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header isDashboard={true} navLinks={dashboardNavLinks} userData={userData} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SubscriptionBanner className="md:top-8" />
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Historial de clases</h2>
            <span className="text-primary-300 bg-primary-500/10 px-3 py-1 rounded-full text-sm">
              {userInterviews.length} clases
            </span>
          </div>

          {hasPastInterviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userInterviews.map((interview) => (
                <ClientInterviewCard
                  key={interview.id}
                  userId={userData?.id}
                  interviewId={interview.id}
                  level={interview.level}
                  type={interview.type}
                  duration={interview.duration}
                  topic={interview.topic}
                  createdAt={interview.createdAt}
                />
              ))}
            </div>
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
                className="btn-primary mx-auto relative overflow-hidden"
                disabled={!userAccess.canAccessClasses}
              >
                {!userAccess.canAccessClasses && (
                  <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                )}
                Recibir tu primera clase
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}