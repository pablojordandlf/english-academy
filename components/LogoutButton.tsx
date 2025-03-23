"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      className="text-gray-300 hover:text-white hover:bg-gray-800"
    >
      Log Out
    </Button>
  );
}
