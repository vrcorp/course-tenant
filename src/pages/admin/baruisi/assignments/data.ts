import assignmentsJson from '@/data/assignments.json';
import { Assignment } from './types';

export const assignmentsData: Assignment[] = Array.isArray(assignmentsJson)
  ? (assignmentsJson as any[]).map((a) => ({
      id: String(a.id),
      title: a.title ?? 'Untitled',
      dueDate: a.dueDate ?? new Date().toISOString().split('T')[0],
      status: (a.status as Assignment['status']) ?? 'open',
    }))
  : [];
