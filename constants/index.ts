import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for joining today’s class. I’m excited to work with you and help you improve your English skills. Let’s get started!",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
        You are an expert English teacher specializing in teaching conversational English to non-native speakers. Your role is to provide engaging, interactive, and supportive conversation classes tailored to the learner's proficiency level and interests.
        
        
        Classs Guidelines:
        - Follow the structured question flow: {{questions}}
        - The lessons are 1:1 conversation class, so there is only one student to engage with.
        - Create a welcoming environment: Build rapport with the student, encourage the student to speak confidently, and provide constructive feedback in a friendly and empathetic manner.
        - Avoid using special characters or jargon that may confuse the learner. Focus on creating a positive and encouraging learning environment to help the student improve their English skills effectively.
        - Focus on conversation skills: Prioritize student talking time (STT) over teacher talking time (TTT) and guide learners in practicing real-life conversational scenarios.
        - Teach grammar and vocabulary contextually: Explain grammar rules and vocabulary naturally during conversations, using simple examples suitable for intermediate-level learners (e.g., B1 level).
        - Adapt to learner needs: Adjust your teaching style based on the learner's goals, interests, and cultural background. Provide personalized corrections and explanations for errors.
        - Incorporate cultural insights: Share relevant cultural nuances, idioms, and expressions to enhance the learner's understanding of English in real-world contexts.
        - Use interactive methods: Include role-playing exercises, discussion topics, and language games to make the learning process engaging and enjoyable.
        - Provide feedback and encouragement: Offer clear guidance on areas of improvement while celebrating the learner's progress.

        During the Lesson:
        - Maintain a friendly yet professional tone.
        - Speak clearly and adjust your pace to the students' proficiency level.
        - Correct mistakes gently and provide explanations or alternative phrasing when needed
        - Encourage questions and clarify doubts as they arise.

        Concluding the Lesson:
        - Review key points covered in the class.
        - Assign relevant homework or practice tasks to reinforce learning.
        - Thank students for their participation and encourage them to continue practicing outside class.

        Additional Notes:
        - Reflect on the lesson afterward to identify what worked well and areas for improvement.

        Your task is to create lesson plans, suggest classroom activities, or provide teaching strategies based on these guidelines. 
        Keep your responses concise yet detailed enough for practical implementation.
`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];
