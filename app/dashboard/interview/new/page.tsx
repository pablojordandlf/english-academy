import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewInterview({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  // Get the current user
  const user = await getCurrentUser();
  const level = searchParams.level || "intermediate";
  
  // List of available topics based on level
  const topics = {
    beginner: [
      "Introducing Yourself",
      "Daily Routines",
      "Family and Friends",
      "Hobbies and Interests",
      "Food and Dining",
      "Weather and Seasons",
    ],
    intermediate: [
      "Travel Experiences",
      "Education and Learning",
      "Work and Careers",
      "Technology in Daily Life",
      "Environmental Issues",
      "Health and Fitness",
    ],
    advanced: [
      "Cultural Differences",
      "Global Economics",
      "Political Systems",
      "Scientific Developments",
      "Media and Journalism",
      "Art and Literature",
    ],
    business: [
      "Job Interviews",
      "Business Meetings",
      "Negotiations",
      "Marketing and Sales",
      "Customer Service",
      "Corporate Strategy",
    ],
  };

  const selectedLevelTopics = topics[level as keyof typeof topics] || topics.intermediate;

  // Function to create a new interview (this would normally be a server action)
  async function handleStartInterview(topic: string) {
    // This is a placeholder - in a real app, you would create an interview and redirect to it
    return redirect(`/dashboard/interview/123`);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Start a New {level.charAt(0).toUpperCase() + level.slice(1)} Class</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/interview">Back to Class Selection</Link>
        </Button>
      </div>

      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-6">Choose a Topic</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedLevelTopics.map((topic, index) => (
            <form action={() => handleStartInterview(topic)} key={index}>
              <Button 
                type="submit"
                variant="outline" 
                className="w-full h-full min-h-24 text-left flex flex-col items-start justify-center p-4 hover:border-primary-500 hover:bg-gray-800"
              >
                <span className="font-medium text-md">{topic}</span>
                <span className="text-xs text-gray-400 mt-1">Click to start conversation</span>
              </Button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}
