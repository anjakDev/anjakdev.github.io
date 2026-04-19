const skills: string[] = [
  "Web Development",
  "React",
  "Node.js",
  "TypeScript",
  "REST API",
  "Flutter",
  "SQLite",
  "Go",
  "GCP",
  "next.js",
  "MongoDB",
  "PostgreSQL",
  "Agentic Development",
]

const COLS = 4
const SORT_ROW_GAP = 12
const GRAVITY_RADIUS = 120
const GRAVITY_STRENGTH = 0.01
const DAMPING = 0.9
const BOUNCE = 0.6
const SPRING = 0.08
const SORT_DURATION_MS = 20000

interface TagBody {
  el: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
}

function renderTag(skill: string, absolute: boolean): string {
  return `<div class="skill-tag${absolute ? ' absolute' : ''}">
      <div class="skill-tag-inner">${skill}</div>
    </div>`
}

export function createSkillsSection(): string {
  const mobileTags = skills.map((s) => renderTag(s, false)).join("\n  ")
  const physicsTags = skills.map((s) => renderTag(s, true)).join("\n  ")

  return `
  <!-- Mobile: static wrapped pills -->
  <div class="lg:hidden flex flex-wrap gap-2">
    ${mobileTags}
  </div>

  <!-- Desktop: physics-driven container -->
  <div id="skills-physics-container" class="hidden lg:block relative w-full overflow-hidden" style="height: 320px;">
    ${physicsTags}
    <button id="skills-sort-btn" class="absolute bottom-3 right-3 font-raleway text-xs text-slate-400 hover:text-slate-600 cursor-pointer select-none px-2 py-1 rounded-full border border-slate-200 bg-cream/80 transition">sort</button>
    <span id="skills-timer" class="absolute bottom-3 left-3 font-raleway text-xs text-slate-400 opacity-0 transition-opacity"></span>
  </div>`
}

export function initSkillsPhysics(): void {
  const container = document.getElementById("skills-physics-container")
  if (!container) return

  const cW = container.offsetWidth
  const cH = container.offsetHeight

  let mouseX = -999
  let mouseY = -999
  let sortedUntil = 0

  const tagEls = Array.from(
    container.querySelectorAll<HTMLElement>(".skill-tag"),
  )

  const bodies: TagBody[] = tagEls.map((el, i) => {
    const w = el.offsetWidth
    const h = el.offsetHeight
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = (col + 0.5) * (cW / COLS) + ((i % 3) - 1) * 20
    const y = 50 + row * 90 + (i % 2) * 15

    el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`

    return { el, x, y, vx: 0, vy: 0, w, h }
  })

  // Compute sorted target positions: 4 per column, as many columns as needed
  const maxTagH = bodies.reduce((max, b) => Math.max(max, b.h), 0)
  const rowSpacing = maxTagH + SORT_ROW_GAP
  const numSortCols = Math.ceil(skills.length / COLS)
  const colWidth = (cW - 32) / numSortCols
  const totalSortH = Math.min(COLS, skills.length) * rowSpacing - SORT_ROW_GAP
  const topPad = Math.max(20, (cH - totalSortH) / 2)

  const targets = skills.map((_, i) => ({
    x: 16 + Math.floor(i / COLS) * colWidth + colWidth / 2,
    y: topPad + (i % COLS) * rowSpacing,
  }))

  const sortBtn = container.querySelector<HTMLButtonElement>("#skills-sort-btn")!
  const timerEl = container.querySelector<HTMLElement>("#skills-timer")!

  sortBtn.addEventListener("click", () => {
    sortedUntil = Date.now() + SORT_DURATION_MS
  })

  container.addEventListener("mousemove", (e: MouseEvent) => {
    const rect = container.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  })

  container.addEventListener("mouseleave", () => {
    mouseX = -999
    mouseY = -999
  })

  let prevSorting = false
  let prevSecsLeft = -1

  function loop() {
    const now = Date.now()
    const sorting = now < sortedUntil
    const secsLeft = sorting ? Math.ceil((sortedUntil - now) / 1000) : 0

    // Physics pass
    for (let i = 0; i < bodies.length; i++) {
      const tag = bodies[i]

      if (sorting) {
        // Spring toward sorted target position
        tag.vx += (targets[i].x - tag.x) * SPRING
        tag.vy += (targets[i].y - tag.y) * SPRING
      } else {
        // Mouse gravity
        const dx = mouseX - tag.x
        const dy = mouseY - tag.y
        const distSq = dx * dx + dy * dy
        if (distSq < GRAVITY_RADIUS * GRAVITY_RADIUS && distSq > 1) {
          tag.vx += dx * GRAVITY_STRENGTH
          tag.vy += dy * GRAVITY_STRENGTH
        }
      }

      tag.vx *= DAMPING
      tag.vy *= DAMPING

      tag.x += tag.vx
      tag.y += tag.vy

      if (tag.x - tag.w / 2 < 0) {
        tag.x = tag.w / 2
        tag.vx = -tag.vx * BOUNCE
      } else if (tag.x + tag.w / 2 > cW) {
        tag.x = cW - tag.w / 2
        tag.vx = -tag.vx * BOUNCE
      }

      if (tag.y - tag.h / 2 < 0) {
        tag.y = tag.h / 2
        tag.vy = -tag.vy * BOUNCE
      } else if (tag.y + tag.h / 2 > cH) {
        tag.y = cH - tag.h / 2
        tag.vy = -tag.vy * BOUNCE
      }
    }

    // Collision pass — skipped during sort mode (spring handles separation)
    if (!sorting) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i]
          const b = bodies[j]
          const overlapX = (a.w + b.w) / 2 - Math.abs(a.x - b.x)
          const overlapY = (a.h + b.h) / 2 - Math.abs(a.y - b.y)
          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              const dir = Math.sign(a.x - b.x) || 1
              const push = (overlapX / 2) * dir
              a.x += push
              b.x -= push
              a.vx = Math.abs(a.vx) * dir * BOUNCE
              b.vx = Math.abs(b.vx) * -dir * BOUNCE
            } else {
              const dir = Math.sign(a.y - b.y) || 1
              const push = (overlapY / 2) * dir
              a.y += push
              b.y -= push
              a.vy = Math.abs(a.vy) * dir * BOUNCE
              b.vy = Math.abs(b.vy) * -dir * BOUNCE
            }
          }
        }
      }
    }

    // DOM write pass — transforms every frame, UI state only on change
    for (const tag of bodies) {
      tag.el.style.transform = `translate(${tag.x - tag.w / 2}px, ${tag.y - tag.h / 2}px)`
    }

    if (sorting !== prevSorting || secsLeft !== prevSecsLeft) {
      timerEl.textContent = sorting ? `gravity in ${secsLeft}s` : ""
      timerEl.style.opacity = sorting ? "1" : "0"
      sortBtn.style.opacity = sorting ? "0" : "1"
      sortBtn.style.pointerEvents = sorting ? "none" : "auto"
      prevSorting = sorting
      prevSecsLeft = secsLeft
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
