interface ContributionDay {
  contributionCount: number
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

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

const WEEKS = 2
const MIN_COMMITS = 5
const ZERO_COLOR = 'rgba(255,255,255,0.07)'

function cellColor(count: number): string {
  if (count === 0) return ZERO_COLOR
  if (count <= 3) return '#0F6E56'
  if (count <= 6) return '#1D9E75'
  return '#3ecfb0'
}

function cell(color: string): string {
  return `<div style="width:11px;height:11px;border-radius:2px;background:${color}"></div>`
}

async function fetchWeeks(): Promise<ContributionWeek[]> {
  const token = import.meta.env.GH_ACTIVITY_TOKEN
  if (!token) {
    console.warn('[github-activity] GH_ACTIVITY_TOKEN is not set — widget hidden')
    return []
  }

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

function buildWidgetHTML(days: ContributionDay[], total: number): string {
  const cells = days.map(d => cell(cellColor(d.contributionCount))).join('')

  return `<a href="https://github.com/anjakDev" target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-6 rounded-xl p-3 z-50 block transition-opacity hover:opacity-80" style="background:rgba(15,20,30,0.88)">
      <div class="flex justify-between items-center mb-2 gap-4">
        <span class="text-xs" style="color:rgba(255,255,255,0.4)">last ${WEEKS} weeks</span>
        <span class="text-xs font-semibold" style="color:#3ecfb0">${total} commits</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${days.length},11px);gap:2px">
        ${cells}
      </div>
    </a>`
}

export function initGithubActivity(): void {
  fetchWeeks()
    .then(weeks => {
      if (weeks.length === 0) return

      const days = weeks
        .flatMap(w => w.contributionDays)
        .sort((a, b) => a.date.localeCompare(b.date))

      const total = days.reduce((sum, d) => sum + d.contributionCount, 0)
      if (total < MIN_COMMITS) return

      const tmp = document.createElement('div')
      tmp.innerHTML = buildWidgetHTML(days, total)
      const widget = tmp.firstElementChild
      if (widget) document.body.appendChild(widget)
    })
    .catch((err: unknown) => {
      console.error('[github-activity] Failed to fetch contribution data', err)
    })
}
