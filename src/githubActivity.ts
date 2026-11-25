interface ContributionDay {
  contributionCount: number
  date: string
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface GithubActivity {
  generatedAt: string
  weeks: ContributionWeek[]
}

export const WEEKS = 4

function cellColor(count: number | null): string {
  if (count === null) return 'transparent'
  if (count === 0) return 'rgba(255,255,255,0.08)'
  if (count <= 3) return '#0F6E56'
  if (count <= 6) return '#1D9E75'
  return '#3ecfb0'
}

function totalCommits(weeks: ContributionWeek[]): number {
  return weeks.reduce((sum, w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, sum), 0)
}

export function createShippingCard({ weeks }: GithubActivity): string {
  const cells = weeks
    .flatMap((week) => {
      // Days outside the range (later this week) stay null and render blank, not as zero-commit days.
      const slots = new Array<number | null>(7).fill(null)
      for (const day of week.contributionDays) {
        slots[new Date(day.date + 'T12:00:00Z').getUTCDay()] = day.contributionCount
      }
      return slots.map((count) => `<div class="aspect-square rounded-sm" style="background:${cellColor(count)}"></div>`)
    })
    .join('')

  return `
    <a href="https://github.com/anjakDev" target="_blank" rel="noopener noreferrer"
       class="rounded-2xl bg-slate-900 text-white p-5 h-full flex flex-col gap-4 transition-opacity hover:opacity-90">
      <p class="font-mono text-[11px] tracking-wider text-white/60">SHIPPING · last ${WEEKS} weeks</p>
      <p class="font-raleway text-sm"><span class="font-archivo-black text-4xl mr-1">${totalCommits(weeks)}</span> commits</p>
      <div class="grid grid-cols-7 gap-1 mt-auto w-full max-w-72">${cells}</div>
    </a>
  `
}
