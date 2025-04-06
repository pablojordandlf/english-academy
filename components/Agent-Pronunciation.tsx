"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { pronunciationTeacher } from "@/constants";
import { createPronunciationFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const AgentPronunciation = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Función para hacer scroll al último mensaje
  const scrollToBottom = () => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = 0;
    }
  };

  // Efecto para hacer scroll cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createPronunciationFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/dashboard/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(pronunciationTeacher, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-6 md:gap-8 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="call-view flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8 w-full">
        {/* AI Teacher Card */}
        <div className={cn(
          "card-interviewer w-full sm:w-auto flex flex-col items-center p-3 sm:p-6 rounded-xl border transition-all duration-300",
          isSpeaking 
            ? "bg-primary-500/20 border-primary-500/40 shadow-lg shadow-primary-500/20" 
            : "bg-gray-800/50 border-primary-500/20"
        )}>
          <div className="avatar relative">
            <div className="relative rounded-full">
              <Image
                src="/gabby_2.png"
                alt="AI Teacher"
                width={55}
                height={45}
                className="object-cover rounded-full sm:w-[65px] sm:h-[54px]"
              />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-pulse-slow" />
              )}
            </div>
          </div>
          <h3 className={cn(
            "text-base sm:text-xl font-medium mt-2 sm:mt-4 transition-colors duration-300",
            isSpeaking ? "text-primary-200" : "text-primary-300"
          )}>Gabby</h3>
          
          {isSpeaking && (
            <div className="bg-primary-500/20 rounded-full px-3 py-1 text-primary-200 text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-primary-300 rounded-full animate-pulse-slow"></span>
              Hablando...
            </div>
          )}
        </div>

        {/* User Profile Card - Hidden on mobile */}
        <div className={cn(
          "card-border hidden sm:flex flex-col items-center p-3 sm:p-6 rounded-xl border transition-all duration-300",
          "bg-gray-800/50 border-primary-500/20 hover:bg-gray-800/70"
        )}>
          <div className="card-content text-center">
            <h3 className="text-base sm:text-xl font-medium">{userName}</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Estudiante</p>
          </div>
        </div>
      </div>

      {/* Conversation Controls */}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button 
            className={cn(
              "text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-full shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base",
              callStatus === "CONNECTING" 
                ? "bg-primary-700 hover:bg-primary-700" 
                : "bg-primary-500 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30"
            )}
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            {callStatus === "CONNECTING" ? (
              <>
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></span>
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></span>
                <span className="ml-1.5 sm:ml-2">Conectando</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Iniciar
              </>
            )}
          </button>
        ) : (
          <button 
            className="bg-destructive-100 hover:bg-destructive-200 text-white font-semibold py-2 sm:py-3 px-4 sm:px-8 rounded-full shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base hover:shadow-xl hover:shadow-destructive-100/30"
            onClick={() => handleDisconnect()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Finalizar clase
          </button>
        )}
      </div>

      {/* Full Transcript Section */}
      {messages.length > 0 && (
        <div className="transcript-border mt-3 sm:mt-6 w-full rounded-lg overflow-hidden shadow-md">
          <div className="bg-primary-500/5 px-2.5 sm:px-3 py-1.5 sm:py-2 border-b border-primary-500/20 flex items-center justify-between">
            <h4 className="text-primary-300 font-medium text-xs sm:text-sm">Transcripción de la conversación</h4>
            <span className="text-[10px] sm:text-xs text-primary-300/70">{messages.length} mensajes</span>
          </div>
          <div 
            ref={transcriptRef}
            className="transcript flex flex-col p-2 sm:p-4 md:p-6 max-h-[200px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-300 transform",
                  "animate-slideIn opacity-100 mb-1.5 sm:mb-3 p-1.5 sm:p-3 rounded-xl max-w-[95%] sm:max-w-[92%] md:max-w-[85%]",
                  message.role === "user" 
                    ? "bg-gray-900/70 ml-auto hover:bg-gray-900/80" 
                    : "bg-primary-500/10 mr-auto hover:bg-primary-500/15",
                  "hover:shadow-lg hover:shadow-primary-500/5"
                )}
              >
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="size-5 sm:size-8 md:size-10 rounded-full overflow-hidden flex-shrink-0 hidden sm:block">
                    {message.role === "user" ? (
                      <Image 
                        src="/gabby_2.png" 
                        alt="user" 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <Image 
                        src="/ai-avatar.png" 
                        alt="ai" 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <p className="text-[10px] sm:text-sm font-medium text-primary-300">
                        {message.role === "user" ? `${userName}` : `Profesor`}
                      </p>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-sm text-gray-300 leading-relaxed break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {callStatus === "ACTIVE" && (
            <div className="bg-primary-500/5 p-1.5 sm:p-2 border-t border-primary-500/20 flex items-center justify-between">
              <div className="text-[10px] sm:text-xs text-primary-300/70 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 sm:h-3 w-2.5 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="hidden sm:inline">La conversación se está grabando automáticamente</span>
                <span className="sm:hidden">Grabando...</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] sm:text-xs text-primary-300/70">En vivo</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentPronunciation;