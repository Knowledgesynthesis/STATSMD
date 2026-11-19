import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface QuestionStat {
  /** Leitner box 1–5: wrong answers return to box 1; each correct answer promotes one box. */
  box: number;
  seen: number;
  correct: number;
  last: number;
  lastCorrect: boolean;
}

interface ProgressState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lessons: Record<string, number>;
  toggleLesson: (id: string) => void;
  questions: Record<string, QuestionStat>;
  recordAnswer: (id: string, correct: boolean) => void;
  cases: Record<string, { score: number; total: number; at: number }>;
  recordCase: (id: string, score: number, total: number) => void;
  reset: () => void;
}

/** Review intervals per Leitner box, in days. */
export const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 16];

export function isDue(stat: QuestionStat | undefined, now = Date.now()): boolean {
  if (!stat) return true;
  return now - stat.last >= BOX_INTERVAL_DAYS[stat.box] * 86_400_000;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      lessons: {},
      toggleLesson: (id) =>
        set((s) => {
          const lessons = { ...s.lessons };
          if (lessons[id]) delete lessons[id];
          else lessons[id] = Date.now();
          return { lessons };
        }),
      questions: {},
      recordAnswer: (id, correct) =>
        set((s) => {
          const prev = s.questions[id];
          const box = correct ? Math.min(5, (prev?.box ?? 1) + 1) : 1;
          return {
            questions: {
              ...s.questions,
              [id]: {
                box,
                seen: (prev?.seen ?? 0) + 1,
                correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
                last: Date.now(),
                lastCorrect: correct,
              },
            },
          };
        }),
      cases: {},
      recordCase: (id, score, total) =>
        set((s) => ({ cases: { ...s.cases, [id]: { score, total, at: Date.now() } } })),
      reset: () => set({ lessons: {}, questions: {}, cases: {} }),
    }),
    { name: 'statsmd-v3', version: 3 },
  ),
);

/** Share of a set of questions whose most recent answer was correct. */
export function mastery(ids: string[], stats: Record<string, QuestionStat>): number {
  if (ids.length === 0) return 0;
  return ids.filter((id) => stats[id]?.lastCorrect).length / ids.length;
}
