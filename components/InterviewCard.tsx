import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  level,
  type,
  topic,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-primary-500/20 text-primary-300",
      Mixed: "bg-blue-500/20 text-blue-300",
      Technical: "bg-green-500/20 text-green-300",
    }[normalizedType] || "bg-primary-500/20 text-primary-300";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("DD MMM, YYYY");

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0">
          <Image
            src={getRandomInterviewCover()}
            alt="class-image"
            fill
            className="object-cover"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium capitalize text-white">
              Clase de Inglés {level}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
              {normalizedType}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>
            
            {feedback && (
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="font-medium text-primary-300">{feedback?.totalScore || "---"}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-5">
        <h4 className="text-sm font-medium text-gray-200 mb-1">Temas de Conversación:</h4>
        <p className="text-gray-400 text-sm line-clamp-2">
          {topic || "Temas de conversación generales adaptados a tu nivel."}
        </p>
      </div>
      
      {feedback && (
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-200 mb-1">Evaluación:</h4>
          <p className="text-gray-400 text-sm line-clamp-2">
            {feedback?.finalAssessment || "No hay evaluación disponible para esta clase."}
          </p>
        </div>
      )}
      
      <div className="mt-auto">
        {feedback ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="btn-secondary">
              <Link href={`/dashboard/interview/${interviewId}/feedback`}>
                Ver evaluación
              </Link>
            </Button>
            <Button asChild className="btn-primary">
              <Link href={`/dashboard/interview/${interviewId}`}>
                Repetir clase
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="btn-primary">
            <Link href={`/dashboard/interview/${interviewId}`}>
              Recibir clase
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;