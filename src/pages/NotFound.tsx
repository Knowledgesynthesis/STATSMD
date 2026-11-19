import { LinkButton, Page } from '../components/ui';

export default function NotFound() {
  return (
    <Page className="max-w-xl text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink-2">The link may be outdated. Start from the course or the Test Finder.</p>
      <div className="mt-6 flex justify-center gap-2">
        <LinkButton href="#/learn">Course</LinkButton>
        <LinkButton href="#/finder" variant="outline">Test Finder</LinkButton>
      </div>
    </Page>
  );
}
