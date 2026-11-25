interface ReadingArticle {
  title: string
  url: string
  feedTitle: string
  publishedAt: string
  readingTime: number
}

export interface ReadingStats {
  generatedAt: string
  feeds: { total: number; categories: number }
  recentReads: ReadingArticle[]
}

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

function buildArticle(article: ReadingArticle): string {
  return `<li>
      <a href="${esc(safeUrl(article.url))}" target="_blank" rel="noopener noreferrer"
         class="font-raleway text-sm font-semibold text-slate-900 leading-snug line-clamp-2 hover:underline">${esc(article.title ?? '(no title)')}</a>
      <span class="font-raleway text-xs text-slate-600">${esc(article.feedTitle ?? '')}</span>
    </li>`
}

export function createReadingCard(stats: ReadingStats): string {
  const articles = stats.recentReads.slice(0, MAX_ARTICLES)
  return `
    <div class="rounded-2xl bg-[#F3EDD3] p-5 h-full">
      <p class="font-mono text-[11px] tracking-wider text-slate-500 mb-3">READING · via Miniflux</p>
      <ul class="flex flex-col gap-2.5">${articles.map(buildArticle).join('')}</ul>
    </div>
  `
}
