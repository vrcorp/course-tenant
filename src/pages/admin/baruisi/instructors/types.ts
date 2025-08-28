export type InstructorStatus = 'active' | 'inactive' | 'suspended';

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  specialization: string;
  courses: number;
  students: number;
  rating: number;
  status: InstructorStatus;
  joinDate: string; // ISO string
  totalEarnings: number;
}
