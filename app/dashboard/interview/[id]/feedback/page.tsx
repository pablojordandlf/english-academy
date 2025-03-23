import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";

export default async function FeedbackPage({
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

  // Mock feedback data - in a real app, this would come from your database
  const feedbackData = {
    pronunciation: 85,
    grammar: 78,
    vocabulary: 82,
    fluency: 75,
    feedback: [
      "Your pronunciation of 'th' sounds has improved significantly.",
      "You used present perfect tense correctly in most instances.",
      "Try to expand your vocabulary around business terminology.",
      "Work on reducing pauses to improve fluency.",
    ],
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback Summary</h1>
        <Button asChild variant="outline">
          <Link href={`/dashboard/interview/${params.id}`}>Back to Conversation</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Pronunciation</p>
              <div className="text-2xl font-bold text-primary-100">{feedbackData.pronunciation}%</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${feedbackData.pronunciation}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Grammar</p>
              <div className="text-2xl font-bold text-primary-100">{feedbackData.grammar}%</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${feedbackData.grammar}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Vocabulary</p>
              <div className="text-2xl font-bold text-primary-100">{feedbackData.vocabulary}%</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${feedbackData.vocabulary}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Fluency</p>
              <div className="text-2xl font-bold text-primary-100">{feedbackData.fluency}%</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${feedbackData.fluency}%` }}></div>
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-3">Detailed Feedback</h3>
          <ul className="space-y-2">
            {feedbackData.feedback.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300">
                <span className="text-primary-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
          
          <div className="mt-8">
            <Button asChild className="w-full">
              <Link href="/dashboard/interview">Start New Class</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
