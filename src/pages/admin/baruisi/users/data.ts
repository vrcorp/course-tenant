import { User } from './types';
import usersJsonData from '@/data/students.json';

// Import users data from JSON file and add default admin fields
export const usersData: User[] = usersJsonData.map((user: any) => ({
  ...user,
  // Add default admin management fields if not present
  phone: user.phone || '+62 812-0000-0000',
  status: (user.status as 'active' | 'inactive' | 'suspended') || 'active',
  location: user.location || 'Indonesia',
  verified: user.verified !== undefined ? user.verified : true
}));
