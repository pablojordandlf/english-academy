import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="inline-block rounded-full bg-gray-800/80 backdrop-blur-sm px-4 py-1.5 mb-2">
            <span className="text-gray-300">Bienvenido</span>
            <span className="text-primary-300 ml-1">{user?.name}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Mejora tu inglés con práctica y retroalimentación en tiempo real
          </h2>
          
          <p className="text-lg text-gray-300">
            Practica conversaciones reales en inglés con nuestro profesor de IA y recibe retroalimentación detallada instantáneamente.
          </p>

          <Button asChild className="btn-primary w-fit">
            <Link href="/dashboard/interview">Iniciar nueva clase</Link>
          </Button>
        </div>

        <div className="relative w-full lg:w-2/5 h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl -z-10" />
          <div className="absolute inset-y-0 inset-x-4 bg-gray-900/50 backdrop-blur-sm rounded-xl -z-5 transform rotate-3"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/robot.png"
              alt="AI English Teacher"
              width={280}
              height={280}
              className="object-contain rounded-xl"
              priority
            />
          </div>
          
          {/* Stats floating card */}
          <div className="absolute -top-4 -right-4 bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-700">
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
                userId={user?.id}
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
              <Button asChild className="btn-primary mx-auto">
                <Link href="/dashboard/interview">Tomar tu primera clase</Link>
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
            <p className="text-sm text-center text-gray-400">Monitorea tu mejora con análisis detallado</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
