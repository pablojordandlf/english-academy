"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { teacher } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

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

const Agent = ({
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
        setMessages((prev) => [...prev, newMessage]);
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

      const { success, feedbackId: id } = await createFeedback({
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

      await vapi.start(teacher, {
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
    <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-lg">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Clase de conversación en tiempo real</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Habla con nuestro profesor de IA para practicar tu inglés. La conversación será evaluada y recibirás retroalimentación detallada al finalizar.
          </p>
        </div>
        
        <div className="call-view">
          {/* AI Teacher Card */}
          <div className="card-interviewer">
            <div className="avatar">
              <Image
                src="/ai-avatar.png"
                alt="AI Teacher"
                width={65}
                height={54}
                className="object-cover"
              />
              {isSpeaking && <span className="animate-speak" />}
            </div>
            <h3 className="text-xl font-medium text-primary-300 mt-4">Profesor de Inglés IA</h3>
            
            {isSpeaking && (
              <div className="bg-primary-500/10 rounded-full px-3 py-1 text-primary-300 text-sm font-medium mt-2">
                Hablando...
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="card-border">
            <div className="card-content">
              <Image 
                src="/user-avatar.png" 
                alt="user" 
                width={65} 
                height={65} 
                className="rounded-full mb-4"
              />
              <h3 className="text-xl font-medium">{userName}</h3>
              <p className="text-gray-400 text-sm">Estudiante</p>
            </div>
          </div>
        </div>

        {/* Conversation Controls */}
        <div className="w-full flex justify-center">
          {callStatus !== "ACTIVE" ? (
            <button 
              className={`${
                callStatus === "CONNECTING" 
                  ? "bg-primary-700 hover:bg-primary-700" 
                  : "bg-primary-500 hover:bg-primary-600"
              } text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2`}
              onClick={() => handleCall()}
              disabled={callStatus === "CONNECTING"}
            >
              {callStatus === "CONNECTING" ? (
                <>
                  <span className="h-2 w-2 bg-white rounded-full animate-ping mr-1"></span>
                  <span className="h-2 w-2 bg-white rounded-full animate-ping mr-1" style={{ animationDelay: "0.2s" }}></span>
                  <span className="h-2 w-2 bg-white rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></span>
                  <span className="ml-2">Conectando</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Iniciar clase
                </>
              )}
            </button>
          ) : (
            <button 
              className="bg-destructive-100 hover:bg-destructive-200 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2"
              onClick={() => handleDisconnect()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Finalizar clase
            </button>
          )}
        </div>

        {/* Full Transcript Section */}
        {messages.length > 0 && (
          <div className="transcript-border mt-6">
            <div className="transcript flex flex-col-reverse overflow-y-auto max-h-[400px] p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100 mb-4 p-4 rounded-lg",
                    message.role === "user" 
                      ? "bg-gray-900/70 ml-12" 
                      : "bg-primary-500/10 mr-12"
                  )}
                >
                  <div className="flex items-start">
                    <div className="size-10 rounded-full overflow-hidden flex-shrink-0 mr-3">
                      {message.role === "user" ? (
                        <Image 
                          src="/user-avatar.png" 
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
                      <p className="text-sm font-medium mb-1 text-primary-300">
                        {message.role === "user" ? `${userName}` : `Profesor`}
                      </p>
                      <p className="text-sm text-gray-300">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agent;