import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import LandingPage from "@/components/landing/LandingPage";

export default async function Home() {
  // Check if the user is authenticated
  const isUserAuthenticated = await isAuthenticated();
  
  // If authenticated, redirect to the dashboard
  if (isUserAuthenticated) {
    redirect("/dashboard");
  }
  
  // Otherwise show the landing page
  return <LandingPage />;
}
