import { hasRightNowData } from './rightNowSection'

export const SECTIONS = [
  { id: 'now', label: 'Right now' },
  { id: 'about', label: 'About me' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** Sections that have content; Right now is left out when the build found no data for it. */
export const VISIBLE_SECTIONS = SECTIONS.filter(({ id }) => id !== 'now' || hasRightNowData)

export function createMenuSection(): string {
  const links = VISIBLE_SECTIONS.map(
    ({ id, label }) =>
      `<a href="#${id}" class="nav-link font-archivo-black text-lg text-slate-900" data-section="${id}">${label}</a>`,
  ).join('\n')

  return `
    <nav class="hidden lg:flex flex-col items-end gap-2">
      ${links}
    </nav>
  `
}
