import { createAboutSection } from './aboutSection'
import { createImageCard } from './imageCard'
import { createMenuSection } from './menuSection'
import { createHero, createSidebarBadge } from './titleSection'
import { initSkillsPhysics } from './skillsSection'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div id="top" class="flex flex-col lg:flex-row lg:min-h-screen">
    <aside class="w-full h-20 lg:h-screen lg:sticky lg:top-0 lg:w-56 shrink-0 bg-linear-to-r from-gradient-cyan to-gradient-yellow flex items-center justify-center lg:flex-col lg:items-end lg:justify-start lg:gap-10 lg:pt-10 lg:pr-6">
      ${createSidebarBadge()}
      ${createMenuSection()}
    </aside>

    <main class="flex-1 min-w-0 bg-cream text-slate-900 flex flex-col">
      <div class="flex flex-col gap-12 px-6 pt-12 lg:px-12 lg:pt-10 lg:flex-row lg:items-start lg:justify-between">
        ${createHero()}

        <div class="flex justify-center w-full lg:w-64 lg:mt-12 shrink-0">
          ${createImageCard()}
        </div>
      </div>

      ${createAboutSection()}
    </main>
  </div>
`

const ACTIVE_LINE_RATIO = 0.3
const BOTTOM_TOLERANCE_PX = 4

function currentSectionId(sections: HTMLElement[]): string | undefined {
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_TOLERANCE_PX
  // The last section is too short to ever reach the active line, so the page bottom selects it.
  if (atBottom) return sections[sections.length - 1]?.id

  const activeLine = window.innerHeight * ACTIVE_LINE_RATIO
  const passed = sections.filter((s) => s.getBoundingClientRect().top <= activeLine)
  // Above the first section (the hero) the first link stays highlighted rather than none or a stale one.
  return (passed[passed.length - 1] ?? sections[0])?.id
}

function initActiveNavLink(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link')
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
  let frame = 0

  const update = () => {
    frame = 0
    const id = currentSectionId(sections)
    links.forEach((link) => link.classList.toggle('active', link.dataset.section === id))
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  update()
}

// The physics measures its container, so start it only once visible (display:none on mobile).
function initSkillsWhenVisible(): void {
  const container = document.getElementById('skills-physics-container')
  if (!container) return
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return
    observer.disconnect()
    initSkillsPhysics()
  })
  observer.observe(container)
}

initActiveNavLink()
initSkillsWhenVisible()
