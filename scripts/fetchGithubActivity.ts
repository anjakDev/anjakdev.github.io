// Runs at build time (through the rightNowData macro) so the token never reaches the browser bundle.

import { WEEKS, type ContributionWeek, type GithubActivity } from '../src/githubActivity'

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: ContributionWeek[]
        }
      }
    }
  }
  errors?: { message: string }[]
}

const MIN_COMMITS = 5

// tsconfig only includes browser types, so read Bun's process.env without relying on Node globals.
function env(name: string): string | undefined {
  return (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env[name]
}

function warn(message: string): void {
  if (env('GITHUB_ACTIONS') === 'true') {
    console.log(`::warning title=GitHub activity card hidden::${message}`)
  } else {
    console.warn(`[github-activity] ${message}`)
  }
}

async function fetchWeeks(token: string): Promise<ContributionWeek[]> {
  // Start on the Sunday WEEKS - 1 weeks back: GitHub's calendar weeks start on Sunday,
  // so this returns exactly WEEKS whole weeks (the current one still in progress).
  const to = new Date()
  const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate() - to.getUTCDay() - 7 * (WEEKS - 1)))

  const query = `{
    user(login: "anjakDev") {
      contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }`

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) {
    const hint = res.status === 401 ? ' (GH_ACTIVITY_TOKEN is probably expired or revoked)' : ''
    warn(`GitHub API responded with ${res.status} ${res.statusText}${hint}`)
    return []
  }

  const json = (await res.json()) as GitHubGraphQLResponse
  if (json.errors?.length) {
    warn(`GraphQL error: ${json.errors[0].message}`)
    return []
  }

  return json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
}

function totalCommits(weeks: ContributionWeek[]): number {
  return weeks.reduce((sum, w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, sum), 0)
}

export async function fetchGithubActivity(): Promise<GithubActivity | null> {
  const token = env('GH_ACTIVITY_TOKEN')
  if (!token) {
    warn('GH_ACTIVITY_TOKEN is not set')
    return null
  }

  try {
    const weeks = await fetchWeeks(token)
    if (totalCommits(weeks) < MIN_COMMITS) return null
    return { generatedAt: new Date().toISOString(), weeks }
  } catch (err) {
    // A failed fetch should hide the card, not break the deploy
    warn(`Failed to fetch contribution data: ${err instanceof Error ? err.message : String(err)}`)
    return null
  }
}
