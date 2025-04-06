import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
  getGeneralClasses,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getGeneralClasses(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });
  console.log("Feedback: ", feedback);

  if (!feedback) redirect(`/dashboard`);

  return (
    <section className="section-feedback">
      <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg mb-8">
        <div className="text-center mb-8">
          <div className="inline-block rounded-full bg-primary-500/10 px-4 py-1.5 mb-2">
            <span className="text-primary-300 text-sm font-medium">EVALUACIÓN DETALLADA</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Resultados de tu Clase de Inglés
          </h1>
          
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Análisis detallado de tu desempeño y recomendaciones personalizadas para mejorar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/60 p-6 rounded-lg flex flex-col items-center">
            <div className="text-5xl font-bold text-primary-500 mb-2">
              {feedback?.totalScore}
            </div>
            <p className="text-sm text-gray-400">Puntuación Total</p>
            <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                style={{ width: `${feedback?.totalScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-lg flex flex-col items-center">
            <div className="bg-primary-500/20 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-1">Fecha de la clase</p>
            <p className="text-xl font-medium text-white">
              {dayjs(feedback?.createdAt).format("DD MMM, YYYY")}
            </p>
            <p className="text-sm text-gray-400">
              {dayjs(feedback?.createdAt).format("h:mm A")}
            </p>
          </div>

          <div className="bg-gray-900/60 p-6 rounded-lg flex flex-col items-center">
            <div className="bg-primary-500/20 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-1">Tipo de clase</p>
            <p className="text-xl font-medium text-white capitalize">
              {interview.type}
            </p>
            <p className="text-sm text-gray-400">Nivel {interview.level}</p>
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Evaluación General</h2>
          <p className="text-gray-300 leading-relaxed">{feedback?.finalAssessment}</p>
        </div>

        {/* Feedback Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index} className="bg-gray-900/50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">{category.name}</h3>
                <div className="flex items-center bg-primary-500/20 px-3 py-1 rounded-full">
                  <span className="text-primary-300 font-bold">{category.score}</span>
                  <span className="text-sm text-gray-400">/100</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                  style={{ width: `${category.score}%` }}
                ></div>
              </div>
              <p className="text-gray-300">{category.comment}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Puntos Fuertes
            </h3>
            <ul className="space-y-3">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-300 mr-2 text-lg">•</span>
                  <span className="text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Áreas de Mejora
            </h3>
            <ul className="space-y-3">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-300 mr-2 text-lg">•</span>
                  <span className="text-gray-300">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Recomendaciones para practicar</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary-300 mr-2 text-lg">•</span>
              <span className="text-gray-300">Practica regularmente con diferentes temas de conversación para expandir tu vocabulario.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-300 mr-2 text-lg">•</span>
              <span className="text-gray-300">Escucha podcasts o ve videos en inglés relacionados con los temas que te interesan.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-300 mr-2 text-lg">•</span>
              <span className="text-gray-300">Toma al menos 3 clases a la semana para ver mejoras significativas en tu fluidez.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Button asChild variant="outline" className="border-gray-700 hover:border-primary-500 text-gray-300 hover:text-primary-300">
            <Link href="/dashboard">
              Volver al Dashboard
            </Link>
          </Button>
          
          <Button asChild className="btn-primary">
            <Link href="/dashboard/interview">
              Recibir otra clase
            </Link>
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
    </section>
  );
};

export default Feedback;
