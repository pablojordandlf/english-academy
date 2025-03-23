import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section id="home" className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">
          Master English with AI-Powered Tutoring
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Enhance your English speaking skills with personalized AI conversations and get instant, detailed feedback to track your progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-500 text-primary-100 hover:bg-gray-800 px-8 py-6">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
      
      <div className="relative w-full md:w-2/5 h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-900/20 rounded-2xl -z-10" />
        <Image
          src="/robot.png"
          alt="AI English Tutor"
          fill
          className="object-contain p-8"
          priority
        />
      </div>
    </section>
  );
}