export type AssignmentStatus = 'open' | 'closed' | 'overdue';

export interface Assignment {
  id: string;
  title: string;
  dueDate: string; // ISO date string
  status: AssignmentStatus;
}
