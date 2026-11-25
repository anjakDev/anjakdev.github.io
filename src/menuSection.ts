export const SECTIONS = [
  { id: 'about', label: 'About me' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export function createMenuSection(): string {
  const links = SECTIONS.map(
    ({ id, label }) =>
      `<a href="#${id}" class="nav-link font-archivo-black text-lg text-slate-900" data-section="${id}">${label}</a>`,
  ).join('\n')

  return `
    <nav class="hidden lg:flex flex-col items-end gap-2">
      ${links}
    </nav>
  `
}
