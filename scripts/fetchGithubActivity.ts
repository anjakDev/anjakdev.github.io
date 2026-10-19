// Runs at build time so the token never reaches the browser bundle.
// Writes the contribution weeks to a static JSON file served next to the page.

import type { ContributionWeek } from '../src/githubActivity'

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

const WEEKS = 4

async function fetchWeeks(token: string): Promise<ContributionWeek[]> {
  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - 7 * WEEKS)

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
    console.error(`[github-activity] GitHub API responded with ${res.status} ${res.statusText}`)
    return []
  }

  const json = (await res.json()) as GitHubGraphQLResponse
  if (json.errors?.length) {
    console.error('[github-activity] GraphQL error:', json.errors[0].message)
    return []
  }

  return json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
}

export async function writeGithubActivity(outPath: string): Promise<void> {
  const token = process.env.GH_ACTIVITY_TOKEN
  if (!token) {
    console.warn('[github-activity] GH_ACTIVITY_TOKEN is not set — widget hidden')
    return
  }

  try {
    const weeks = await fetchWeeks(token)
    if (weeks.length === 0) return
    await Bun.write(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), weeks }))
  } catch (err) {
    // A failed fetch should hide the widget, not break the deploy
    console.error('[github-activity] Failed to fetch contribution data', err)
  }
}
