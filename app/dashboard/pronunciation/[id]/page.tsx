import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, Target, Repeat, Star, BarChart } from "lucide-react";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { getAllPronunciationByUserId } from "@/lib/actions/pronunciation.action";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  // Obtener todas las clases de pronunciación del usuario
  const allPronunciations = await getAllPronunciationByUserId(user.id);
  
  // Encontrar la clase específica por ID
  const interview = allPronunciations.find(p => p.id === id);
  
  if (!interview) {
    redirect("/dashboard");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  console.log("Interview:", interview);
  console.log("Feedback:", feedback);

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado con navegación */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al Dashboard</span>
          </Link>
        </Button>
        
        {feedback && (
          <Button asChild className="btn-primary">
            <Link href={`/dashboard/pronunciation/${id}/feedback`} className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Ver evaluación</span>
            </Link>
          </Button>
        )}
      </div>
      
      {/* Componente de agente para la práctica */}
      <div id="conversation" className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-lg font-medium mb-4 text-primary-100 flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary-300" />
          Practica con Gabby
        </h3>
        
        <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-700">
          <Agent
            userName={user.name}
            userId={user.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
          />
        </div>
      </div>
      
      {/* Tarjeta principal */}
      <div className="bg-gray-800/70 backdrop-blur-sm p-4 sm:p-8 rounded-xl border border-gray-700 shadow-lg">
        {/* Encabezado de la clase */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-primary-500 shadow-lg shadow-primary-500/20">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Clase de Pronunciación</h2>
              <p className="text-gray-400 mb-3">Mejora tu pronunciación con Gabby</p>
            </div>
          </div>
          
          {feedback && (
            <div className="flex items-center bg-gradient-to-r from-primary-500/20 to-primary-700/20 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-primary-500/30 shadow-lg w-full sm:w-auto">
              <div className="text-center mr-4 sm:mr-6">
                <span className="block text-3xl sm:text-4xl font-bold text-primary-300">{feedback.totalScore}</span>
                <span className="text-xs text-gray-300">Puntuación</span>
              </div>
              
              <div className="h-12 w-0.5 bg-primary-500/30 mr-4 sm:mr-6"></div>
              
              <div>
                <h4 className="text-white font-medium mb-1">¡Buen trabajo!</h4>
                <p className="text-xs text-gray-300 max-w-[200px]">
                  {feedback.finalAssessment?.substring(0, 100) || "Sigue practicando para mejorar tu pronunciación."}
                  {feedback.finalAssessment?.length > 100 ? "..." : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sección de práctica */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-primary-100 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary-300" />
            Frases para practicar
          </h3>
          
          <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-700">
            <ul className="space-y-3 sm:space-y-4">
              {interview.questions.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-300 mr-2 sm:mr-3 text-lg font-bold">{index + 1}.</span>
                  <span className="text-gray-300 text-base sm:text-lg">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Mensaje de motivación */}
        {feedback && (
          <div className="bg-gradient-to-r from-primary-500/10 to-primary-700/10 border border-primary-500/20 rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="rounded-full bg-primary-500/20 p-2 sm:p-3 mt-0.5">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary-300" />
              </div>
              <div>
                <h4 className="font-medium text-primary-300 mb-1 sm:mb-2">¡Puedes practicar esta clase varias veces!</h4>
                <p className="text-sm text-gray-300">
                  Cada vez que repitas esta conversación, podrás mejorar tu fluidez y confianza. 
                  Las repeticiones te ayudarán a perfeccionar tu pronunciación y superar tu puntuación anterior.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button asChild variant="outline" className="btn-secondary flex-1 sm:flex-none">
            <Link href="/dashboard">
              <span className="hidden sm:inline">Volver al Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </Button>
          
          {feedback && (
            <>
              <Button asChild className="btn-secondary flex-1 sm:flex-none">
                <Link href={`/dashboard/pronunciation/${id}/feedback`}>
                  <span className="hidden sm:inline">Ver evaluación detallada</span>
                  <span className="sm:hidden">Evaluación</span>
                </Link>
              </Button>
              <Button asChild className="btn-primary flex-1 sm:flex-none">
                <Link href="#conversation">
                  Repetir clase
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