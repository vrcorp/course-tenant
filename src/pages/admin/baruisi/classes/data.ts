import classesJson from '@/data/classes.json';
import { Class } from './types';

export const classesData: Class[] = Array.isArray(classesJson)
  ? (classesJson as any[]).map((c) => ({
      id: String(c.id),
      title: c.title ?? 'Untitled',
      date: c.date ?? new Date().toISOString(),
      students: c.students ?? 0,
      status: (c.status as Class['status']) ?? 'scheduled',
    }))
  : [];
