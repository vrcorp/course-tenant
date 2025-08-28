import quizzesJson from '@/data/quizzes.json';
import { Quiz } from './types';

export const quizzesData: Quiz[] = Array.isArray(quizzesJson)
  ? (quizzesJson as any[]).map((q) => ({
      id: String(q.id),
      title: q.title ?? 'Untitled',
      questions: q.questions ?? 0,
      status: (q.status as Quiz['status']) ?? 'draft',
    }))
  : [];
