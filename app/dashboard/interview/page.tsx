import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function Interview() {
  // Get current user
  const user = await getCurrentUser();

  return (
    <section className="flex flex-col gap-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Start a New Class</h1>
      <p className="text-gray-400">
        Choose your level, topic, and get started with an English conversation
        class. You&apos;ll receive real-time feedback and can review your
        performance afterward.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Beginner Level</h2>
          <p className="text-gray-400 mb-6">
            Ideal for those who are just starting to learn English
          </p>
          <Button asChild className="btn-primary w-full">
            <Link href="/dashboard/interview/new?level=beginner">
              Start Beginner Class
            </Link>
          </Button>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Intermediate Level</h2>
          <p className="text-gray-400 mb-6">
            For learners with a basic foundation in English
          </p>
          <Button asChild className="btn-primary w-full">
            <Link href="/dashboard/interview/new?level=intermediate">
              Start Intermediate Class
            </Link>
          </Button>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Advanced Level</h2>
          <p className="text-gray-400 mb-6">
            For proficient English speakers looking to refine their skills
          </p>
          <Button asChild className="btn-primary w-full">
            <Link href="/dashboard/interview/new?level=advanced">
              Start Advanced Class
            </Link>
          </Button>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Business English</h2>
          <p className="text-gray-400 mb-6">
            Focused on professional vocabulary and business scenarios
          </p>
          <Button asChild className="btn-primary w-full">
            <Link href="/dashboard/interview/new?level=business">
              Start Business Class
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
