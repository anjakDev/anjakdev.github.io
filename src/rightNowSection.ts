import { loadRightNowData, type RightNowData } from '../scripts/rightNowData' with { type: 'macro' }
import { createShippingCard } from './githubActivity'
import { createReadingCard } from './readingCard'

// Bun awaits a macro's promise while bundling and inlines the resolved value, which TypeScript can't see.
const { reading, github } = loadRightNowData() as unknown as RightNowData

const loaded = [
  reading && { card: createReadingCard(reading), source: 'Miniflux', generatedAt: reading.generatedAt },
  github && { card: createShippingCard(github), source: 'GitHub', generatedAt: github.generatedAt },
].filter((part) => !!part)

export const hasRightNowData = loaded.length > 0

function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp
  if (!Number.isFinite(diffMs) || diffMs < 0) return 'recently'
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

export function createRightNowMeta(): string {
  const sources = loaded.map((p) => p.source).join(' & ')
  const newest = Math.max(...loaded.map((p) => Date.parse(p.generatedAt)).filter(Number.isFinite))
  return `<p class="font-mono text-xs text-slate-600"><span class="text-emerald-700">●</span> live from ${sources} · updated ${relativeTime(newest)}</p>`
}

export function createRightNowSection(): string {
  const cards =
    loaded.length === 1 ? `<div class="lg:col-span-2">${loaded[0].card}</div>` : loaded.map((p) => p.card).join('')
  // Grid rows stretch, so the taller card sets the height of both.
  return `<div class="grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">${cards}</div>`
}
