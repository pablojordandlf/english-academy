"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtenemos información del plan de los parámetros de búsqueda
  const plan = searchParams.get('plan');
  const billingCycle = searchParams.get('billing') as 'monthly' | 'yearly';

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Iniciando proceso de autenticación:", { type, hasPlanInfo: !!plan });
      
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Preparamos la información del plan si está disponible
        const planInfo = plan && billingCycle ? {
          plan,
          billingCycle: billingCycle as 'monthly' | 'yearly'
        } : {
          // Configuramos un plan predeterminado si no hay uno seleccionado
          plan: 'PREMIUM',
          billingCycle: 'monthly' as const
        };

        console.log("Registrando usuario con planInfo:", planInfo);
        
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
          planInfo
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // Obtenemos el token para la sesión
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
          return;
        }

        // Iniciamos sesión con el token obtenido
        await signIn({
          email,
          idToken,
        });

        toast.success("Cuenta creada correctamente.");
        console.log("Usuario registrado correctamente. Redirigiendo...");

        // Si tiene información del plan específica de los parámetros, redirigimos al checkout
        if (plan && billingCycle) {
          console.log("Redirigiendo al checkout con plan:", { plan, billingCycle });
          router.push(`/checkout?plan=${plan}&billing=${billingCycle}`);
        } else {
          // Activamos el período de prueba automáticamente
          try {
            console.log("Activando período de prueba automáticamente");
            const trialResponse = await fetch('/api/subscription/activate-trial', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                planId: 'PREMIUM',
                billingCycle: 'monthly',
              }),
            });

            const trialData = await trialResponse.json();
            
            if (trialData.success) {
              console.log("Período de prueba activado correctamente:", trialData);
              toast.success("¡Período de prueba activado correctamente!");
            } else {
              console.error("Error al activar período de prueba:", trialData);
            }
          } catch (trialError) {
            console.error("Error en la activación de la prueba:", trialError);
          }
          
          // Redirigimos al dashboard
          console.log("Redirigiendo al dashboard");
          router.push("/dashboard");
        }
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Sesión iniciada correctamente.");
        
        // Verificar si hay una URL de redirección almacenada en sessionStorage
        const redirectUrl = typeof window !== 'undefined' ? sessionStorage.getItem('redirectAfterLogin') : null;
        
        if (redirectUrl) {
          // Eliminar la URL almacenada
          sessionStorage.removeItem('redirectAfterLogin');
          console.log("Redirigiendo a URL guardada:", redirectUrl);
          router.push(redirectUrl);
        } else {
          console.log("Redirigiendo al dashboard");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error en el proceso de autenticación:", error);
      toast.error(`Ha ocurrido un error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">MyBabbly</h2>
        </div>

        <h3>Practica conversaciones en inglés con IA</h3>

        {plan && billingCycle && type === "sign-up" && (
          <div className="bg-gray-800/50 p-4 rounded-lg mb-2">
            <p className="text-primary-300 font-medium mb-1">Plan seleccionado: {plan}</p>
            <p className="text-gray-300 text-sm">
              Ciclo de facturación: {billingCycle === 'monthly' ? 'Mensual' : 'Anual'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Primero crea tu cuenta y luego te guiaremos al proceso de pago.
            </p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Nombre"
                placeholder="Tu nombre"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Tu dirección de email"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Contraseña"
              placeholder="Introduce tu contraseña"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Iniciar Sesión" : "Registrarse"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
