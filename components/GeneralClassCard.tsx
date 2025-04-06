"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Lock, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface GeneralClassCardProps {
  interviewId: string;
  userId: string;
  level: string;
  type: string;
  topic: string | string[];
  duration: string;
  createdAt?: string;
}

const GeneralClassCard = ({
  interviewId,
  userId,
  level,
  type,
  topic,
  duration,
  createdAt,
}: GeneralClassCardProps) => {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    level,
    topic: typeof topic === 'string' ? topic : Array.isArray(topic) ? topic.join(", ") : "",
    duration
  });
  const { userAccess, handleAccessAttempt } = useAccessControl();
  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId || !interviewId) return;
      
      try {
        const response = await fetch(`/api/feedback?interviewId=${interviewId}&userId=${userId}`);
        const data = await response.json();
        if (data && data.feedback) {
          setFeedback(data.feedback);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [interviewId, userId]);

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

  const handleClassAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userAccess.canAccessClasses) {
      handleAccessAttempt();
      return;
    }
    router.push(`/dashboard/general-class/${interviewId}`);
  };

  return (
    <>
      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 group">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
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
                  Clase de Conversación: {level}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
                  {normalizedType}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                
                
                {feedback && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="font-medium text-primary-300">{feedback?.totalScore || "---"}/100</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          
        </div>
        
        <div className="mb-5">
          <h4 className="text-sm font-medium text-gray-200 mb-1">Temas de Conversación:</h4>
          <p className="text-gray-400 text-sm line-clamp-2">
            {typeof topic === 'string' 
              ? topic 
              : Array.isArray(topic) && topic.length > 0 
                ? topic.join(", ") 
                : "Temas de conversación generales adaptados a tu nivel."}
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
              <Button 
                asChild={userAccess.canAccessClasses} 
                variant="outline" 
                className={cn(
                  "btn-secondary",
                  !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700 cursor-not-allowed"
                )}
                disabled={!userAccess.canAccessClasses}
                onClick={!userAccess.canAccessClasses ? handleAccessAttempt : undefined}
              >
                {!userAccess.canAccessClasses ? (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                    Ver evaluación
                  </>
                ) : (
                  <Link href={`/dashboard/general-class/${interviewId}/feedback`}>
                    Ver evaluación
                  </Link>
                )}
              </Button>
              
              <Button
                className={cn(
                  "btn-primary relative overflow-hidden",
                  !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700 cursor-not-allowed"
                )}
                disabled={!userAccess.canAccessClasses}
                onClick={handleClassAccess}
              >
                {!userAccess.canAccessClasses ? (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                    Repetir clase
                    {!userAccess.canAccessClasses && userAccess.subscriptionStatus === 'expired' && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md">
                        Expirado
                      </span>
                    )}
                  </>
                ) : (
                  "Repetir clase"
                )}
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Button
              className={cn(
                "btn-primary relative overflow-hidden",
                !userAccess.canAccessClasses && "!bg-gray-700 !text-gray-400 border-red-500/30 hover:!bg-gray-700 cursor-not-allowed"
              )}
              disabled={!userAccess.canAccessClasses}
              onClick={handleClassAccess}
            >
              {!userAccess.canAccessClasses ? (
                <>
                  <Lock className="w-3.5 h-3.5 mr-2 text-red-500" />
                  Recibir clase
                  {!userAccess.canAccessClasses && userAccess.subscriptionStatus === 'expired' && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md">
                      Expirado
                    </span>
                  )}
                </>
              ) : (
                "Recibir clase"
              )}
            </Button>
          )}
        </div>
      </div>

    </>
  );
};

export default GeneralClassCard; 