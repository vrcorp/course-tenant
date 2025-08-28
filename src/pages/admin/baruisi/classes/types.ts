export type ClassStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Class {
  id: string;
  title: string;
  date: string; // ISO date string
  students: number;
  status: ClassStatus;
}
