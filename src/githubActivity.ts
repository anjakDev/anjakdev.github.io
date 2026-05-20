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

const WEEKS = 4
const MIN_COMMITS = 5
const CELL_SIZE = '11px'


function cellColor(count: number): string {
  if (count === 0) return 'rgba(255,255,255,0.07)'
  if (count <= 3) return '#0F6E56'
  if (count <= 6) return '#1D9E75'
  return '#3ecfb0'
}

function cell(color: string): string {
  return `<div style="width:${CELL_SIZE};height:${CELL_SIZE};border-radius:2px;background:${color}"></div>`
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

function buildWidgetHTML(weeks: ContributionWeek[], total: number): string {
  const cells = weeks.flatMap(week => {
    const slots = new Array<number>(7).fill(0)
    for (const day of week.contributionDays) {
      slots[(new Date(day.date + 'T12:00:00Z').getUTCDay() + 6) % 7] = day.contributionCount
    }
    return slots.map(count => cell(cellColor(count)))
  }).join('')

  return `<a href="https://github.com/anjakDev" target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-6 rounded-xl p-3 z-50 block transition-opacity hover:opacity-80" style="background:rgba(15,20,30,0.88)">
      <div class="flex flex-col mb-2 gap-1">
        <span class="text-xs" style="color:rgba(255,255,255,0.4)">last ${WEEKS} weeks</span>
        <span class="text-xs font-semibold" style="color:#3ecfb0">${total} commits</span>
      </div>
      <div style="display:grid;grid-template-rows:repeat(7,${CELL_SIZE});grid-auto-columns:${CELL_SIZE};grid-auto-flow:column;gap:2px">
        ${cells}
      </div>
    </a>`
}

export function initGithubActivity(): void {
  fetchWeeks()
    .then(weeks => {
      if (weeks.length === 0) return

      const total = weeks.reduce((sum, w) => w.contributionDays.reduce((s, d) => s + d.contributionCount, sum), 0)
      if (total < MIN_COMMITS) return

      const tmp = document.createElement('div')
      tmp.innerHTML = buildWidgetHTML(weeks, total)
      const widget = tmp.firstElementChild
      if (widget) document.body.appendChild(widget)
    })
    .catch((err: unknown) => {
      console.error('[github-activity] Failed to fetch contribution data', err)
    })
}
