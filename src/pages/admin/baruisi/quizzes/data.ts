import quizzesJson from '@/data/quizzes.json';
import coursesJson from '@/data/courses.json';
import { Quiz } from './types';

const rawQuizzes: any[] = (quizzesJson as any)?.quizzes ?? [];
export const quizzesData: Quiz[] = rawQuizzes.map((q) => ({
  id: String(q.id),
  courseId: q.courseId,
  title: q.title ?? 'Untitled',
  description: q.description ?? '',
  duration: q.duration ?? 0,
  passingScore: q.passingScore ?? 0,
  status: q.status ?? 'draft',
  createdAt: q.createdAt ?? new Date().toISOString(),
  questions: Array.isArray(q.questions) ? q.questions : [],
}));

// helper to get course title
export const getCourseTitle = (courseId: string): string => {
  const course = (coursesJson as any)?.courses?.find((c: any) => c.id === courseId);
  return course?.title ?? 'Unknown Course';
};
