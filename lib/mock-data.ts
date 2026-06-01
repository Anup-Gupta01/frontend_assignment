import type { Course, ActivityDay, UserProfile } from "@/types";
import { daysAgo } from "@/lib/utils";

// ── Mock User ─────────────────────────────────────────────────
export const MOCK_USER: UserProfile = {
  id: "user-1",
  name: "Alex Rivera",
  avatar_url: undefined,
  streak_days: 23,
  total_xp: 12_480,
  hours_studied: 147,
  rank: 14,
};

// ── Mock Courses ──────────────────────────────────────────────
export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Advanced Algorithms",
    instructor: "Dr. Sarah Chen",
    progress: 72,
    color: "#10b981",
    icon: "Brain",
    category: "Computer Science",
    total_lessons: 48,
    completed_lessons: 35,
    created_at: daysAgo(60),
  },
  {
    id: "c2",
    title: "Quantum Mechanics",
    instructor: "Prof. James Okafor",
    progress: 45,
    color: "#06b6d4",
    icon: "Atom",
    category: "Physics",
    total_lessons: 36,
    completed_lessons: 16,
    created_at: daysAgo(45),
  },
  {
    id: "c3",
    title: "Machine Learning Ops",
    instructor: "Dr. Leila Hassan",
    progress: 88,
    color: "#8b5cf6",
    icon: "Cpu",
    category: "Data Science",
    total_lessons: 52,
    completed_lessons: 46,
    created_at: daysAgo(90),
  },
  {
    id: "c4",
    title: "Distributed Systems",
    instructor: "Prof. Marco Silva",
    progress: 31,
    color: "#f59e0b",
    icon: "Network",
    category: "Systems",
    total_lessons: 40,
    completed_lessons: 12,
    created_at: daysAgo(20),
  },
  {
    id: "c5",
    title: "Linear Algebra II",
    instructor: "Dr. Yuki Tanaka",
    progress: 60,
    color: "#ec4899",
    icon: "Calculator",
    category: "Mathematics",
    total_lessons: 30,
    completed_lessons: 18,
    created_at: daysAgo(55),
  },
  {
    id: "c6",
    title: "Compiler Design",
    instructor: "Prof. Aisha Nwosu",
    progress: 15,
    color: "#14b8a6",
    icon: "Code",
    category: "Computer Science",
    total_lessons: 44,
    completed_lessons: 7,
    created_at: daysAgo(10),
  },
];

// ── Mock Activity (364 days = 52 weeks) ───────────────────────
function seedRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateMockActivity(): ActivityDay[] {
  const rand = seedRand(42);
  const days: ActivityDay[] = [];

  for (let i = 363; i >= 0; i--) {
    const date = daysAgo(i);
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 0.3 : 0.6;

    // Simulate study patterns with streaks
    const r = rand();
    let minutes = 0;
    if (r < base * 0.4) {
      minutes = 0;
    } else if (r < base * 0.7) {
      minutes = Math.floor(rand() * 45 + 15);
    } else if (r < base * 0.9) {
      minutes = Math.floor(rand() * 60 + 60);
    } else {
      minutes = Math.floor(rand() * 90 + 120);
    }

    days.push({ date, minutes_studied: minutes });
  }

  return days;
}
