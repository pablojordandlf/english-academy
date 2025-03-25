import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MyBubbly Logo" width={38} height={32} />
          <h2 className="text-primary-100 font-bold">MyBubbly</h2>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
          <LogoutButton />
        </div>
      </nav>

      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
