// Core types for StatsMD application

export type VariableType = 'continuous' | 'categorical' | 'ordinal' | 'binary' | 'time-to-event' | 'count';

export type StudyDesignType =
  | 'rct'
  | 'cohort'
  | 'case-control'
  | 'cross-sectional'
  | 'diagnostic-accuracy'
  | 'before-after'
  | 'time-series';

export type ComparisonType =
  | 'two-groups'
  | 'multiple-groups'
  | 'paired'
  | 'regression'
  | 'correlation'
  | 'proportion';

export type AssumptionType =
  | 'normality'
  | 'homoscedasticity'
  | 'independence'
  | 'linearity'
  | 'proportional-hazards'
  | 'no-multicollinearity';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  description: string;
  role: 'outcome' | 'predictor' | 'confounder' | 'stratification';
}

export interface StatisticalTest {
  id: string;
  name: string;
  displayName: string;
  category: 'parametric' | 'non-parametric' | 'regression' | 'survival';
  applicableTo: {
    outcomeType: VariableType[];
    predictorTypes: VariableType[];
    comparisonTypes: ComparisonType[];
    studyDesigns: StudyDesignType[];
  };
  assumptions: AssumptionType[];
  alternatives: string[]; // IDs of alternative tests
  interpretation: {
    outputMetrics: string[];
    clinicalRelevance: string;
  };
  examples: string[];
}

export interface StudyDesign {
  id: StudyDesignType;
  name: string;
  description: string;
  characteristics: {
    temporality: 'prospective' | 'retrospective' | 'cross-sectional';
    intervention: boolean;
    randomization: boolean;
  };
  strengthOfEvidence: 'high' | 'moderate' | 'low';
  commonUses: string[];
  limitations: string[];
}

export interface Assumption {
  id: AssumptionType;
  name: string;
  description: string;
  howToCheck: string[];
  whatIfViolated: string;
  remedies: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'test' | 'concept' | 'assumption' | 'measure' | 'design';
  relatedTerms: string[];
  examples?: string[];
}

export interface CaseVignette {
  id: string;
  title: string;
  scenario: string;
  dataDescription: {
    outcome: Variable;
    predictors: Variable[];
    sampleSize: number;
    studyDesign: StudyDesignType;
  };
  correctTest: string;
  incorrectTests: Array<{
    testId: string;
    whyIncorrect: string;
  }>;
  interpretation: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'scenario' | 'assumption-check' | 'interpretation';
  question: string;
  scenario?: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface UserProgress {
  completedModules: string[];
  assessmentScores: Record<string, number>;
  bookmarks: string[];
  lastAccessed: Date;
}
