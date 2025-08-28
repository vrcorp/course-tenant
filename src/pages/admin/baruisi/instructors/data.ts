import { Instructor } from './types';
import instructorsJson from '@/data/instructors.json';

export const instructorsData: Instructor[] = (instructorsJson as any[]).map((i) => ({
  ...i,
  avatar: i.avatar || '',
}));
