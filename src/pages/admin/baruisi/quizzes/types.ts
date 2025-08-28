export type QuizStatus = 'draft' | 'published' | 'archived';

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  status: QuizStatus;
}
