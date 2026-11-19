import { Suspense, lazy, useEffect } from 'react';
import { Footer, Header } from './components/Layout';
import { useProgress } from './lib/progress';
import { useRoute } from './lib/router';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const Finder = lazy(() => import('./pages/Finder'));
const Methods = lazy(() => import('./pages/Methods'));
const Labs = lazy(() => import('./pages/Labs'));
const Cases = lazy(() => import('./pages/Cases'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Glossary = lazy(() => import('./pages/Glossary'));
const References = lazy(() => import('./pages/References'));
const CheatSheet = lazy(() => import('./pages/CheatSheet'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TITLES: Record<string, string> = {
  learn: 'Course',
  finder: 'Test Finder',
  methods: 'Methods atlas',
  labs: 'Interactive labs',
  cases: 'Clinical cases',
  quiz: 'Quiz',
  glossary: 'Glossary',
  references: 'References',
  cheatsheet: 'Cheat sheet',
};

function useTheme() {
  const theme = useProgress((s) => s.theme);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && mq.matches));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

export default function App() {
  useTheme();
  const { parts } = useRoute();
  const [section, id] = parts;

  useEffect(() => {
    document.title = section && TITLES[section] ? `${TITLES[section]} · StatsMD` : 'StatsMD — Medical statistics, from test choice to interpretation';
  }, [section]);

  let page;
  switch (section) {
    case undefined:
      page = <Home />;
      break;
    case 'learn':
      page = id ? <ModulePage id={id} /> : <Learn />;
      break;
    case 'finder':
      page = <Finder />;
      break;
    case 'methods':
      page = <Methods id={id} />;
      break;
    case 'labs':
      page = <Labs id={id} />;
      break;
    case 'cases':
      page = <Cases id={id} />;
      break;
    case 'quiz':
      page = <Quiz />;
      break;
    case 'glossary':
      page = <Glossary />;
      break;
    case 'references':
      page = <References />;
      break;
    case 'cheatsheet':
      page = <CheatSheet />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<div className="mx-auto h-96 max-w-6xl animate-pulse px-4 py-12" aria-label="Loading" />}>{page}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
