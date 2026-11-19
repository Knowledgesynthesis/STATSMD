/**
 * Content model. Text fields use a small markdown dialect rendered by <Prose>:
 *   **bold**  *italic*  `code`  [label](#/route)
 *   [[glossary-id]] or [[glossary-id|label]]  → inline definition popover
 *   {{ref-id}} or {{ref-a,ref-b}}            → citation link to References
 * Blocks: blank-line separated paragraphs, "- " bullets, "1. " lists,
 * "### " headings, "> " quotes, ``` code fences, and | pipe | tables |.
 */

export interface Reference {
  id: string;
  /** Author-year label shown inline, e.g. "Greenland 2016" */
  short: string;
  citation: string;
  url?: string;
  /** Why this source matters, in one line */
  note?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  def: string;
  example?: string;
  see?: string[];
  /** Module where the term is taught */
  module?: string;
}

export type MethodFamily =
  | 'Compare means / distributions'
  | 'Compare proportions'
  | 'Regression'
  | 'Time-to-event'
  | 'Correlated / repeated data'
  | 'Association & agreement'
  | 'Diagnostic accuracy'
  | 'Evidence synthesis';

export interface Method {
  id: string;
  name: string;
  aka?: string;
  family: MethodFamily;
  /** Outcome / data it handles, in a few words */
  data: string;
  use: string;
  assumptions: string[];
  ifViolated: string;
  /** What to report: effect estimate + CI */
  report: string;
  pitfalls: string[];
  example: string;
  alternatives: string[];
  refs: string[];
  module?: string;
}

export interface DecisionResult {
  primary: string;
  also?: string[];
  why: string;
  watch?: string;
}

export interface DecisionOption {
  label: string;
  detail?: string;
  next?: string;
  result?: DecisionResult;
}

export interface DecisionNode {
  id: string;
  question: string;
  help?: string;
  options: DecisionOption[];
}

export type LabId =
  | 'variable-sorter'
  | 'distribution'
  | 'ci-coverage'
  | 'p-dance'
  | 'power'
  | 'two-by-two'
  | 'or-vs-rr'
  | 'diagnostic'
  | 'multiplicity'
  | 'regression'
  | 'simpson'
  | 'rtm'
  | 'km'
  | 'calibration'
  | 'agreement'
  | 'forest';

export type LessonSection =
  | { kind: 'text'; title?: string; body: string }
  | { kind: 'lab'; lab: LabId; caption?: string }
  | { kind: 'callout'; tone: 'pitfall' | 'rule' | 'example' | 'tip'; title: string; body: string };

export interface Module {
  id: string;
  n: number;
  title: string;
  tagline: string;
  minutes: number;
  objectives: string[];
  sections: LessonSection[];
  takeaways: string[];
}

export interface Question {
  id: string;
  module: string;
  level: 1 | 2 | 3;
  stem: string;
  options: string[];
  /** Index into options of the single best answer */
  answer: number;
  why: string;
  refs?: string[];
}

export interface CaseStep {
  prompt: string;
  options: { text: string; correct?: boolean; feedback: string }[];
}

export interface Case {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  modules: string[];
  scenario: string;
  steps: CaseStep[];
  debrief: string;
  refs?: string[];
}
