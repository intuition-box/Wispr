import type { Role, AILevel } from "@wispr/ontology";

export type SwipeDirection = "like" | "dislike";

export type SwipePhase = "role" | "maturity" | "result" | "components";

export interface QuestionNode {
  id: string;
  block: "role" | "maturity";
  text: string;
  next: {
    like: string;
    dislike: string;
  };
}

export interface DecisionTree {
  start: string;
  maturity_start: string;
  questions: Record<string, QuestionNode>;
}

export interface SwipeState {
  phase: SwipePhase;
  currentQuestionId: string;
  history: Array<{ questionId: string; direction: SwipeDirection }>;
  role: Role | null;
  level: AILevel | null;
  questionsAnswered: number;
  totalQuestionsInPhase: number;
}
