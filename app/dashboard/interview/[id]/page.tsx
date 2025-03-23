import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";

export default async function InterviewPage({
  params,
}: {
  params: { id: string };
}) {
  // Get current user and interview data
  const user = await getCurrentUser();
  const interview = await getInterviewById(params.id);

  if (!interview) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {interview.topic} - {interview.level} Level
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Your Conversation</h2>
          <div className="bg-gray-900 rounded-lg p-4 h-[400px] overflow-y-auto">
            {/* Interview content would go here */}
            <p className="text-gray-400">
              {interview.topic ? `Conversation about: ${interview.topic}` : "No conversation data available."}
            </p>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline">Continue Practice</Button>
            <Button asChild>
              <Link href={`/dashboard/interview/${params.id}/feedback`}>
                View Feedback
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Session Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Topic</p>
              <p className="font-medium">{interview.topic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Level</p>
              <p className="font-medium">{interview.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="font-medium">{interview.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-medium">
                {new Date(interview.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
