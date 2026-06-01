// Shared TypeScript interfaces for the Student Dashboard
export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;        // 0–100
  color: string;           // accent hex
  icon: string;            // Lucide icon name
  category: string;
  total_lessons: number;
  completed_lessons: number;
  created_at: string;
}

export interface ActivityDay {
  date: string;            // ISO date string YYYY-MM-DD
  minutes_studied: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  streak_days: number;
  total_xp: number;
  hours_studied: number;
  rank: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: number;          // positive = up, negative = down
  color: string;
}
