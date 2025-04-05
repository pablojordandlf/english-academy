import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-700 shadow-lg">
        <div className="flex justify-between items-start mb-4 sm:mb-6 md:mb-8 flex-col md:flex-row gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
            <Button asChild variant="outline" size="sm" className="border-gray-700 hover:border-primary-500">
              <Link href="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </Link>
            </Button>
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-primary-500">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">
                  Clase: {interview.level}
                </h2>
                <span className="bg-primary-500/20 text-primary-300 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                  {interview.type}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">Practica tu inglés con Gabby</p>
            </div>
          </div>
          
          {feedback && (
            <div className="flex items-center bg-gray-900/60 px-3 sm:px-5 py-2 sm:py-3 rounded-lg w-full sm:w-auto mt-4 sm:mt-0">
              <div className="text-center mr-3 sm:mr-4">
                <span className="block text-2xl sm:text-3xl font-bold text-primary-300">{feedback.totalScore}</span>
                <span className="text-xs text-gray-400">Puntuación</span>
              </div>
              
              <div className="h-10 sm:h-12 w-0.5 bg-gray-700 mr-3 sm:mr-4"></div>
              
              <Button asChild className="btn-primary w-full sm:w-auto">
                <Link href={`/dashboard/interview/${id}/feedback`}>
                  Ver evaluación
                </Link>
              </Button>
            </div>
          )}
        </div>


        <div id="conversation">
          <Agent
            userName={user?.name!}
            userId={user?.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
          />
        </div>


        <div className="bg-gray-900/50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-primary-100">Temas de conversación</h3>
          <ul className="space-y-2 sm:space-y-3">
            {interview.questions.map((question, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-300 mr-2 text-base sm:text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">{question}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-900/40 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-1.5 sm:p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-sm sm:text-base text-white">Duración estimada</h4>
            </div>
          </div>
          
          <div className="bg-gray-900/40 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-1.5 sm:p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-medium text-sm sm:text-base text-white">Nivel</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-8 capitalize">{interview.level}</p>
          </div>
          
          <div className="bg-gray-900/40 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-1.5 sm:p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-medium text-sm sm:text-base text-white">Temática</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 pl-6 sm:pl-8">{interview.topic}</p>
          </div>
        </div>

        {feedback && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="rounded-full bg-primary-500/20 p-1.5 sm:p-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-primary-300 mb-1">¡Puedes practicar esta clase varias veces!</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Cada vez que repitas esta conversación, podrás mejorar tu fluidez y confianza. 
                  Las repeticiones te ayudarán a perfeccionar tu pronunciación y superar tu puntuación anterior.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button asChild variant="outline" className="btn-secondary w-full sm:w-auto">
            <Link href="/dashboard">
              Volver al Dashboard
            </Link>
          </Button>
          
          {feedback && (
            <>
              <Button asChild className="btn-secondary w-full sm:w-auto">
                <Link href={`/dashboard/interview/${id}/feedback`}>
                  Ver evaluación detallada
                </Link>
              </Button>
              <Button asChild className="btn-primary w-full sm:w-auto">
                <Link href="#conversation">
                  Repetir esta clase
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;