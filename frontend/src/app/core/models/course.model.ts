import { SafeUser } from './user.model';

export interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
  courseId: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  courseId: number;
  user?: SafeUser;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  price: number;
  instructorId: number;
  avgRating: number;
  enrollCount: number;
  instructor?: SafeUser;
  lessons?: Lesson[];
  reviews?: Review[];
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  completedLessons: number[]; // Array of lesson IDs
  enrolledAt: string;
  completedAt: string | null;
  course?: Course;
}
