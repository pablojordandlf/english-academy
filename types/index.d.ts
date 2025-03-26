interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  level: string;
  questions: string[];
  topic: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  subscription?: Subscription;
  trialEndsAt?: string;
  trialActive?: boolean;
  trialStartedAt?: string;
  trialPlan?: {
    planId: string;
    billingCycle: 'monthly' | 'yearly';
  };
  trialUsed?: boolean;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  level: string;
  type: string;
  topic: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
  planInfo?: {
    plan: string;
    billingCycle: 'monthly' | 'yearly';
  };
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  level: string;
  type: string;
  topic: string[];
  amount: number;
}

interface TechIconProps {
  topic: string[];
}

interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  planId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCheckoutSessionParams {
  userId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
  couponCode?: string;
}

interface ManageSubscriptionParams {
  userId: string;
  stripeCustomerId: string;
  returnUrl: string;
}
