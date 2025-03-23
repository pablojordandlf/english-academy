  import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { topic, level, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare an English class plan.
        The proficiency level of the students is ${level}.
        The topic or theme of the class is: ${topic}.
        Please return only the class plan, without any additional text.
        The plan should be formatted as a structured list like this:
        [
          "Introduction to Topic", 
          "Speaking activity 1", 
          "Vocabulary practice", 
          ...
        ]

        Only include the following sections adapted to the topic selected by the user (${topic}): 
        - Introduction to Topic
        - Speaking activity 1
        - Vocabulary practice
        - Grammar focus and practice
        - Speaking activity 2
        - Pronunciation practice
        - Review and Wrap-up

        Thank you! <3
      `
    });

    const interview = {
      level: level,
      topic: topic.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Interview:", interview);

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
