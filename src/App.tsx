import { ArrowRight, BookOpen } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center gap-2 mb-8">
          <div
            aria-hidden
            className="h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center text-[11px] font-bold tracking-[0.04em]"
          >
            FP
          </div>
          <span className="text-sm font-semibold tracking-tight">FlexPrice</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance text-foreground">
          Component library for
          <br className="hidden sm:block" /> usage-based billing UIs.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
          Atoms, molecules, and organisms extracted from the FlexPrice admin app —
          documented in Storybook with controls, interaction tests, dark mode, and
          a fully composed dashboard demo.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <a
            href="/?path=/docs/introduction--docs"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Browse Storybook
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="/?path=/docs/showcase-dashboard--docs"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-md border border-border bg-card text-sm font-medium hover:bg-accent transition-colors"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Dashboard demo
          </a>
        </div>
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
          {[
            { k: '15', v: 'Components' },
            { k: '47', v: 'Tests' },
            { k: '10k', v: 'Virtual rows' },
            { k: '3 / 3', v: 'Challenges' },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-md border border-border bg-card p-4"
            >
              <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                {s.k}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.v}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
