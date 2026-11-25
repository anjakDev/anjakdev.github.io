// Bun macro: runs while bundling (build and dev server), and its result is inlined into the page,
// so Right now renders with the first paint instead of loading and shifting the layout afterwards.

import readingStats from '../reading-stats.json'
import type { GithubActivity } from '../src/githubActivity'
import type { ReadingStats } from '../src/readingCard'
import { fetchGithubActivity } from './fetchGithubActivity'

export interface RightNowData {
  reading: ReadingStats | null
  github: GithubActivity | null
}

function validReading(stats: ReadingStats): ReadingStats | null {
  return stats.generatedAt && Array.isArray(stats.recentReads) && stats.recentReads.length > 0 ? stats : null
}

export async function loadRightNowData(): Promise<RightNowData> {
  return {
    reading: validReading(readingStats as ReadingStats),
    github: await fetchGithubActivity(),
  }
}
