import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { topic, level, userid, duration } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare an English class plan for a 1:1 conversation class with only one student.
        The proficiency level of the student is ${level}.
        The topic or theme of the class is: ${topic}.
        Adjust the activitied planned for the lesson to theduration of the class to ${duration} minutes.
        Please return only the class plan, without any additional text.
        The plan should be formatted as a structured list like this:
        [
          "Introduction to Topic", 
          "Speaking activity 1", 
          "Vocabulary practice", 
          ...
        ]

        Only include the following sections adapted to the topic and duration selected by the user (${topic} and ${duration} minutes): 
        - Introduction to Topic
        - Speaking activity 1
        - Vocabulary practice
        - Grammar focus and practice
        - Speaking activity 2
        - Pronunciation practice
        - Review and Wrap-up

      Avoid creating group activities, as there is only one student.

        Thank you! <3
      `
    });

    const interview = {
      level: level,
      topic: topic.split(","),
      duration: duration,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Interview: ", interview);

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