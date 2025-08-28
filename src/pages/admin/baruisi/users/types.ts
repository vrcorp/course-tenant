export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
  purchaseDate: string;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
  role: 'user' | 'admin' | 'super_admin' | 'affiliator' | 'instructor';
  hasLmsTenant: boolean;
  tenantSlug: string | null;
  coursesProgress: CourseProgress[];
  // Optional fields for admin management
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  location?: string;
  verified?: boolean;
  // Optional fields that may not be in JSON data
  lmsTenants?: string[];
  hasVideoHosting?: boolean;
  totalCoursesCompleted?: number;
  totalWatchTime?: string;
  certificates?: number;
}
