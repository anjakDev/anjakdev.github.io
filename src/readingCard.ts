interface ReadingArticle {
  title: string
  url: string
  feedTitle: string
  publishedAt: string
  readingTime: number
}

interface ReadingStats {
  generatedAt: string
  feeds: { total: number; categories: number }
  recentReads: ReadingArticle[]
}

const ACCENT_COLORS = ['#3ecfb0', '#c8e86a', '#FFE566']
const MAX_ARTICLES = 5

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function safeUrl(url: string): string {
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:' ? url : '#'
  } catch {
    return '#'
  }
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 60) return `updated ${mins} minute${mins !== 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `updated ${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `updated ${days} day${days !== 1 ? 's' : ''} ago`
}

function buildArticle(article: ReadingArticle, index: number): string {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]
  return `<div style="border-left:3px solid ${accent};padding-left:10px" class="mb-2 last:mb-0">
    <a href="${safeUrl(article.url)}" target="_blank" rel="noopener noreferrer"
       class="font-raleway text-sm font-semibold text-slate-800 hover:underline block leading-snug">${esc(article.title)}</a>
    <span class="font-raleway text-xs" style="color:rgba(100,116,139,0.72)">${esc(article.feedTitle)}</span>
  </div>`
}

function buildCardBody(stats: ReadingStats): string {
  const articles = stats.recentReads.slice(0, MAX_ARTICLES)
  return `
    <p class="font-raleway text-xs font-semibold mb-3" style="color:rgba(100,116,139,0.55);letter-spacing:0.12em">NOW READING</p>
    <div>${articles.map(buildArticle).join('')}</div>
    <p class="font-raleway text-xs mt-3" style="color:rgba(100,116,139,0.42)">${relativeTime(stats.generatedAt)}</p>
  `
}

function buildHTML(stats: ReadingStats): string {
  const count = Math.min(stats.recentReads.length, MAX_ARTICLES)

  return `
    <div id="reading-toggle"
         class="lg:hidden flex items-center justify-between px-4 py-3 cursor-pointer"
         style="background:rgba(0,0,0,0.055);border:0.5px solid rgba(62,207,176,0.35);border-radius:0.5rem">
      <div class="flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#3ecfb0;flex-shrink:0">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span class="font-raleway text-sm font-semibold" style="color:rgba(100,116,139,0.85)">now reading</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-raleway text-xs" style="background:rgba(62,207,176,0.12);color:#3ecfb0;border-radius:9999px;padding:2px 10px">${count} article${count !== 1 ? 's' : ''}</span>
        <svg id="reading-chevron" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:rgba(100,116,139,0.5);transition:transform 0.2s ease">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
    <div id="reading-content" class="reading-card-content" style="display:none">
      <div id="reading-inner" class="p-3" style="background:rgba(0,0,0,0.055);border:0.5px solid rgba(62,207,176,0.35);border-radius:0.5rem">
        ${buildCardBody(stats)}
      </div>
    </div>
  `
}

async function fetchStats(): Promise<ReadingStats | null> {
  try {
    const res = await fetch('/reading-stats.json')
    if (!res.ok) return null
    const json = (await res.json()) as ReadingStats
    if (!json.generatedAt || !Array.isArray(json.recentReads)) return null
    return json
  } catch {
    return null
  }
}

export function initReadingCard(): void {
  fetchStats().then(stats => {
    if (!stats) return
    const container = document.getElementById('reading-card-container')
    if (!container) return

    container.innerHTML = buildHTML(stats)

    const toggle = document.getElementById('reading-toggle')
    const content = document.getElementById('reading-content')
    const inner = document.getElementById('reading-inner')
    const chevron = document.getElementById('reading-chevron')
    if (!toggle || !content || !inner || !chevron) return

    let expanded = false
    toggle.addEventListener('click', () => {
      expanded = !expanded
      content.style.display = expanded ? 'block' : 'none'
      chevron.style.transform = expanded ? 'rotate(180deg)' : ''
      toggle.style.borderRadius = expanded ? '0.5rem 0.5rem 0 0' : '0.5rem'
      inner.style.borderTop = expanded ? 'none' : ''
      inner.style.borderRadius = expanded ? '0 0 0.5rem 0.5rem' : '0.5rem'
    })
  })
}
