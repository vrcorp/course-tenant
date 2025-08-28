import coursesJson from '@/data/courses.json';
import { Course } from './types';

export const coursesData: Course[] = Array.isArray((coursesJson as any).courses)
  ? (coursesJson as any).courses.map((c: any) => ({
      id: String(c.id),
      title: c.title ?? 'Untitled',
      thumbnail: c.thumbnail ?? 'https://placehold.co/600x400?text=Course',
      category: c.category ?? 'general',
      status: (c.status as Course['status']) ?? 'draft',
    }))
  : [];
