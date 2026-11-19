import { useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, RotateCcw, Trophy } from 'lucide-react';
import { modules, modulesById } from '../content/modules';
import { questions } from '../content/questions';
import type { Question } from '../content/types';
import { QuestionCard } from '../components/QuestionCard';
import { Button, Card, Page, PageHeader, ProgressBar, Segmented } from '../components/ui';
import { isDue, mastery, useProgress } from '../lib/progress';
import { navigate, useRoute } from '../lib/router';
import { createRng, randomSeed } from '../lib/stats/random';

type Mode = 'review' | 'mixed' | 'module';
const SESSION = 10;

function pick(pool: Question[], n: number, seed: number) {
  const rng = createRng(seed);
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export default function Quiz() {
  const { query } = useRoute();
  const stats = useProgress((s) => s.questions);
  const mode = (query.get('mode') as Mode) || 'mixed';
  const moduleId = query.get('m') ?? modules[0].id;
  const [seed, setSeed] = useState(randomSeed);
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);

  const session = useMemo(() => {
    if (mode === 'review') {
      // Due items first: wrong last time, then lowest Leitner box, then never seen.
      const due = questions.filter((q) => stats[q.id] && isDue(stats[q.id]));
      const ordered = [...due].sort((a, b) => Number(stats[a.id].lastCorrect) - Number(stats[b.id].lastCorrect) || stats[a.id].box - stats[b.id].box);
      const fresh = questions.filter((q) => !stats[q.id]);
      return [...ordered, ...pick(fresh, SESSION, seed)].slice(0, SESSION);
    }
    if (mode === 'module') return questions.filter((q) => q.module === moduleId);
    return pick(questions, SESSION, seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, moduleId, seed]);

  const restart = () => {
    setSeed(randomSeed());
    setPos(0);
    setScore(0);
  };
  const setMode = (m: Mode) => {
    navigate(`/quiz?mode=${m}${m === 'module' ? `&m=${moduleId}` : ''}`);
    restart();
  };
  const q = session[pos];
  const finished = pos >= session.length;
  const [answered, setAnswered] = useState(false);

  return (
    <Page className="max-w-4xl">
      <PageHeader eyebrow="Practice" title="Question bank">
        {questions.length} questions with full explanations. Review mode uses spaced repetition: questions you miss come back sooner; ones you know are spaced out.
      </PageHeader>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Segmented label="Quiz mode" value={mode} onChange={setMode} options={[{ value: 'mixed', label: 'Mixed 10' }, { value: 'review', label: 'Review due' }, { value: 'module', label: 'By module' }]} />
        {mode === 'module' && (
          <select
            aria-label="Module"
            value={moduleId}
            onChange={(e) => {
              navigate(`/quiz?mode=module&m=${e.target.value}`);
              restart();
            }}
            className="h-10 w-full min-w-0 max-w-full rounded-lg border border-line-strong bg-surface px-3 text-sm sm:w-auto"
          >
            {modules.map((m) => <option key={m.id} value={m.id}>{m.n}. {m.title}</option>)}
          </select>
        )}
      </div>

      {session.length === 0 ? (
        <Card className="p-6 text-ink-2">Nothing due for review right now. Try a mixed set, or come back later.</Card>
      ) : !finished ? (
        <>
          <div className="mb-3 flex items-center gap-3 text-sm text-ink-2">
            <span className="tabular">Question {pos + 1} of {session.length}</span>
            <ProgressBar value={pos / session.length} label="Session progress" className="max-w-xs" />
            <span className="tabular ml-auto">Score {score}</span>
          </div>
          <div className="mb-2 text-xs text-muted">Module {modulesById[q.module].n}: {modulesById[q.module].title}</div>
          <QuestionCard
            key={`${q.id}-${seed}-${pos}`}
            q={q}
            onAnswered={(c) => {
              setAnswered(true);
              if (c) setScore((s) => s + 1);
            }}
          />
          <div className="mt-4 flex justify-end">
            <Button
              disabled={!answered}
              onClick={() => {
                setAnswered(false);
                setPos((p) => p + 1);
              }}
            >
              {pos + 1 === session.length ? 'Finish' : 'Next'} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <Card className="p-6 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-warn-text" />
          <div className="text-2xl font-bold">{score} / {session.length}</div>
          <p className="mt-1 text-ink-2">{score === session.length ? 'Perfect session.' : 'Missed questions are scheduled for review.'}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button onClick={restart}><RotateCcw className="h-4 w-4" /> New set</Button>
            <Button variant="outline" onClick={() => setMode('review')}><RefreshCw className="h-4 w-4" /> Review due</Button>
          </div>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold">Mastery by module</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {modules.map((m) => {
            const ids = questions.filter((x) => x.module === m.id).map((x) => x.id);
            const v = mastery(ids, stats);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  navigate(`/quiz?mode=module&m=${m.id}`);
                  restart();
                }}
                className="min-w-0 rounded-lg border border-line bg-surface p-3 text-left hover:border-primary"
              >
                <div className="mb-1.5 flex min-w-0 justify-between gap-2 text-sm"><span className="min-w-0 truncate">{m.n}. {m.title}</span><span className="tabular shrink-0 font-semibold">{Math.round(v * 100)}%</span></div>
                <ProgressBar value={v} label={`${m.title} mastery`} />
              </button>
            );
          })}
        </div>
      </section>
    </Page>
  );
}
