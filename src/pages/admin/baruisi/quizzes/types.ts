export type QuizStatus = 'draft' | 'published' | 'archived';

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  answer: string | number | boolean;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number; // minutes
  passingScore: number; // percentage
  status: QuizStatus;
  createdAt: string;
  questions: QuizQuestion[];
}
