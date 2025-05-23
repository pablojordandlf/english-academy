"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

import { Button } from "./ui/button";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Lock, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface PronunciationClassCardProps {
  interviewId: string;
  userId: string;
  level?: string;
  type?: string;
  topic?: string | string[];
  duration?: string;
  createdAt?: string;
  questions?: string[];
}

const PronunciationClassCard = ({
  interviewId,
  userId,
  level = "Intermedio",
  type = "Pronunciación",
  topic,
  duration = "10",
  createdAt,
  questions = [],
}: PronunciationClassCardProps) => {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    level,
    topic: typeof topic === 'string' ? topic : Array.isArray(topic) ? topic.join(", ") : "",
    duration
  });
  
  const { userAccess, handleAccessAttempt } = useAccessControl();
  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId || !interviewId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/feedback?interviewId=${interviewId}&userId=${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el feedback');
        }
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

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("DD MMM, YYYY");

  const handleClassAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userAccess.canAccessClasses) {
      handleAccessAttempt();
      return;
    }
    router.push(`/dashboard/pronunciation/${interviewId}`);
  };

  const handleDeleteInterview = async () => {
    if (!interviewId || !userId) return;
    
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/pronunciation/delete?interviewId=${interviewId}&userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("Clase eliminada correctamente");
        // Recargar la página o actualizar la lista
        router.refresh();
        // Si estamos en la página de detalles, volver al dashboard
        if (window.location.pathname.includes(interviewId)) {
          router.push('/dashboard');
        }
      } else {
        const data = await response.json();
        toast.error(data.error || "Error al eliminar la clase");
      }
    } catch (error) {
      console.error("Error eliminando la clase:", error);
      toast.error("Error al eliminar la clase");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
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
                  Clase de Pronunciación {level}
                </h3>
                
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                               
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
                
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-destructive-100 hover:bg-destructive-100/10 h-8 w-8"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
                  <Link href={`/dashboard/pronunciation/${interviewId}/feedback`}>
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

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Eliminar clase</DialogTitle>
            <DialogDescription className="text-gray-300">
              ¿Estás seguro que deseas eliminar esta clase? Esta acción no se puede deshacer y también eliminará cualquier evaluación asociada.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button 
              variant="ghost" 
              className="border border-gray-700 hover:bg-gray-700 text-gray-300"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="bg-destructive-100 hover:bg-destructive-200 text-white"
              onClick={handleDeleteInterview}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PronunciationClassCard; 