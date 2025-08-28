export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  category?: string;
  status: CourseStatus;
}
