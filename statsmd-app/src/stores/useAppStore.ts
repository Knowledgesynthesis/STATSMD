import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Variable, StudyDesignType, UserProgress } from '../types';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // User selections for test recommendation
  outcome: Variable | null;
  setOutcome: (outcome: Variable | null) => void;

  predictors: Variable[];
  addPredictor: (predictor: Variable) => void;
  removePredictor: (predictorId: string) => void;
  clearPredictors: () => void;

  studyDesign: StudyDesignType | null;
  setStudyDesign: (design: StudyDesignType | null) => void;

  sampleSize: number | null;
  setSampleSize: (size: number | null) => void;

  pairedData: boolean;
  setPairedData: (paired: boolean) => void;

  // User progress
  userProgress: UserProgress;
  completeModule: (moduleId: string) => void;
  updateAssessmentScore: (assessmentId: string, score: number) => void;
  toggleBookmark: (itemId: string) => void;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Reset selections
  resetSelections: () => void;
}

const initialUserProgress: UserProgress = {
  completedModules: [],
  assessmentScores: {},
  bookmarks: [],
  lastAccessed: new Date(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      darkMode: true, // Default to dark mode as per requirements
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // User selections
      outcome: null,
      setOutcome: (outcome) => set({ outcome }),

      predictors: [],
      addPredictor: (predictor) =>
        set((state) => ({ predictors: [...state.predictors, predictor] })),
      removePredictor: (predictorId) =>
        set((state) => ({
          predictors: state.predictors.filter((p) => p.id !== predictorId),
        })),
      clearPredictors: () => set({ predictors: [] }),

      studyDesign: null,
      setStudyDesign: (design) => set({ studyDesign: design }),

      sampleSize: null,
      setSampleSize: (size) => set({ sampleSize: size }),

      pairedData: false,
      setPairedData: (paired) => set({ pairedData: paired }),

      // User progress
      userProgress: initialUserProgress,
      completeModule: (moduleId) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            completedModules: [...state.userProgress.completedModules, moduleId],
            lastAccessed: new Date(),
          },
        })),
      updateAssessmentScore: (assessmentId, score) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            assessmentScores: {
              ...state.userProgress.assessmentScores,
              [assessmentId]: score,
            },
            lastAccessed: new Date(),
          },
        })),
      toggleBookmark: (itemId) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            bookmarks: state.userProgress.bookmarks.includes(itemId)
              ? state.userProgress.bookmarks.filter((id) => id !== itemId)
              : [...state.userProgress.bookmarks, itemId],
          },
        })),

      // Navigation
      currentView: 'home',
      setCurrentView: (view) => set({ currentView: view }),

      // Reset
      resetSelections: () =>
        set({
          outcome: null,
          predictors: [],
          studyDesign: null,
          sampleSize: null,
          pairedData: false,
        }),
    }),
    {
      name: 'statsmd-storage', // localStorage key
      partialize: (state) => ({
        darkMode: state.darkMode,
        userProgress: state.userProgress,
      }),
    }
  )
);
