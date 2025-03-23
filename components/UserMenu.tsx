"use client";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth.action";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  name: string;
  email: string;
  id: string;
}

interface Props {
  user: User;
}

const UserMenu = ({ user }: Props) => {
  const handleSignOut = async () => {
    "use server";
    await signOut();
    redirect("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium shadow-md">
          {getInitials(user.name)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-gray-800/95 backdrop-blur-sm border border-gray-700 p-2 rounded-xl shadow-xl">
        <div className="flex items-center gap-3 p-3">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 text-white font-medium flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-white">{user.name}</span>
            <span className="text-sm text-gray-400">{user.email}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-700/50 my-1" />
        
        <DropdownMenuItem className="flex gap-3 text-gray-300 hover:text-white focus:text-white hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer p-3 rounded-lg">
          <Link href="/dashboard" className="flex items-center gap-3 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Panel de control
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex gap-3 text-gray-300 hover:text-white focus:text-white hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer p-3 rounded-lg">
          <Link href="/dashboard/progress" className="flex items-center gap-3 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Mi progreso
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex gap-3 text-gray-300 hover:text-white focus:text-white hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer p-3 rounded-lg"
          asChild
        >
          <form action={handleSignOut}>
            <button type="submit" className="flex items-center gap-3 text-left w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu; 