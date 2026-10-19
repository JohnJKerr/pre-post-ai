const Code = ({ children }: { children: string }) => <code className="font-now-mono text-[13px] text-base-content">{children}</code>

export function MethodFooter({ weeks, isSample }: { weeks: number; isSample: boolean }) {
  const notes = [
    ['Lines and commits', <>Weekly totals per repo from <Code>/stats/contributors</Code>. These cover the whole repo, so lock files and generated code count, and repos with 10,000+ commits report no lines.</>],
    ['Punch card, hours, evenings and weekends', <><Code>/stats/punch_card</Code> counts every author for all time, so only projects you wrote 90%+ of, that sit wholly on one side of the cut-off, are used.</>],
    ['Languages', <>Byte shares from <Code>/languages</Code>, weighted by your lines in each window. CSS and HTML are left out. A new language needs at least 5% after the cut-off and at most 1% before it.</>],
    ['Active days', <>Your GitHub contribution calendar.</>],
    ['Shift score', <>10× the commits earns 28 points and 10× the lines earns 12. Four times the projects earns 15, four new languages earn 20, and twice as many active days earns 25.</>],
    ['Windows', <>{weeks} weeks either side of the week the cut-off falls in, so both sides cover the same amount of time.</>],
  ] as const
  return (
    <footer aria-labelledby="method" className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-2">
          <h2 id="method" className="text-sm font-semibold text-muted">How this was measured</h2>
          <p className="max-w-[44ch] text-lg font-bold tracking-tight sm:text-2xl" style={{ textWrap: 'balance' }}>
            We never read your code. The GitHub App asks for one permission: repository metadata, read-only.
          </p>
        </div>
        <dl className="grid gap-x-10 gap-y-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(([title, body]) => (
            <div key={title} className="flex flex-col gap-1.5 border-t border-base-300 pt-3">
              <dt className="font-semibold">{title}</dt>
              <dd className="text-muted">{body}</dd>
            </div>
          ))}
        </dl>
        <p className="flex flex-wrap justify-between gap-2 font-now-mono text-xs text-muted">
          <span>Shift{isSample && ' · sample data'}</span>
          <span>Built on GitHub metadata only</span>
        </p>
      </div>
    </footer>
  )
}
