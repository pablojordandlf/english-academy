import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getGeneralClasses
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getGeneralClasses(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  console.log("Feedback: ", feedback);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
        <div className="flex justify-between items-start mb-8 flex-col md:flex-row gap-6">
          
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary-500">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white capitalize">
                  Clase: {interview.level}
                </h2>
                <span className="bg-primary-500/20 text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                  {interview.type}
                </span>
              </div>
              <p className="text-gray-400">Practica tu inglés con Gabby</p>
            </div>
          </div>
          
          {feedback && (
            <div className="flex items-center bg-gray-900/60 px-5 py-3 rounded-lg">
              <div className="text-center mr-4">
                <span className="block text-3xl font-bold text-primary-300">{feedback.totalScore}</span>
                <span className="text-xs text-gray-400">Puntuación</span>
              </div>
              
              <div className="h-12 w-0.5 bg-gray-700 mr-4"></div>
              
              <Button asChild className="btn-primary">
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


        <div className="bg-gray-900/50 p-6 rounded-xl mb-6 mt-6">
          <h3 className="text-lg font-medium mb-4 text-primary-100">Temas de conversación</h3>
          <ul className="space-y-3">
            {interview.questions.map((question, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-300 mr-2 text-lg">•</span>
                <span className="text-gray-300">{question}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/40 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-white">Duración estimada</h4>
            </div>
          </div>
          
          <div className="bg-gray-900/40 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-medium text-white">Nivel</h4>
            </div>
            <p className="text-sm text-gray-400 pl-8 capitalize">{interview.level}</p>
          </div>
          
          <div className="bg-gray-900/40 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-full bg-primary-500/20 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-medium text-white">Temática</h4>
            </div>
            <p className="text-sm text-gray-400 pl-8">{interview.topic}</p>
          </div>
        </div>

        {feedback && (
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary-500/20 p-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-primary-300 mb-1">¡Puedes practicar esta clase varias veces!</h4>
                <p className="text-sm text-gray-300">
                  Cada vez que repitas esta conversación, podrás mejorar tu fluidez y confianza. 
                  Las repeticiones te ayudarán a perfeccionar tu pronunciación y superar tu puntuación anterior.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="btn-secondary">
            <Link href="/dashboard">
              Volver al Dashboard
            </Link>
          </Button>
          
          {feedback && (
            <>
              <Button asChild className="btn-secondary">
                <Link href={`/dashboard/interview/${id}/feedback`}>
                  Ver evaluación detallada
                </Link>
              </Button>
              <Button asChild className="btn-primary">
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