interface TagGroup {
  label: string
  tags: string[]
}

interface ProjectData {
  title: string
  label: string
  description: string
  tagGroups: TagGroup[]
}

const projects: ProjectData[] = [
  {
    title: 'Bluetooth Lamp Control App',
    label: 'Mobile — Flutter, iOS/Android',
    description:
      'Cross-platform mobile app for real-time control of networked IoT lighting hardware over Bluetooth Low Energy. Built Figma designs into Flutter UI, extended the API integration and stream handling layers, and implemented in-app file caching from Google Cloud Storage to reduce network load.',
    tagGroups: [
      { label: 'State', tags: ['StreamBuilder', 'Provider', 'ChangeNotifier', 'StatefulWidget'] },
      { label: 'Comms', tags: ['REST API'] },
      { label: 'Cloud', tags: ['Google Cloud Storage', 'Firebase Analytics'] },
      { label: 'Lang', tags: ['Dart', 'Go'] },
    ],
  },
  {
    title: 'Manufacturing Data Management',
    label: 'Full-stack Web — Next.js, TypeScript',
    description:
      'Replaced a dysfunctional shared Excel spreadsheet with a proper full-stack web app as the single source of truth for manufacturing data. Fully owned end-to-end: database schema, API, frontend, and deployment on GCP App Engine.',
    tagGroups: [
      { label: 'Frontend', tags: ['Next.js', 'React', 'TypeScript'] },
      { label: 'Backend', tags: ['tRPC', 'Prisma', 'PostgreSQL'] },
      { label: 'Infra', tags: ['GCP App Engine', 'OAuth / OpenID Connect'] },
    ],
  },
]

function createTagGroup(group: TagGroup): string {
  const pills = group.tags
    .map(
      (tag) =>
        `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-raleway font-medium bg-gradient-cyan/10 text-gradient-cyan">${tag}</span>`
    )
    .join(' ')

  return `<div class="flex flex-wrap items-center gap-y-2 lg:gap-y-1 gap-x-2">
      <span class="font-raleway text-xs uppercase tracking-widest text-slate-400 shrink-0 w-full lg:w-auto">${group.label}</span>
      ${pills}
    </div>`
}

function createProjectCard(project: ProjectData): string {
  const tagGroupsHtml = project.tagGroups.map(createTagGroup).join('\n    ')

  return `<div class="project-card-wrapper">
    <div class="bg-cream rounded-lg p-5 flex flex-col gap-3">
      <div>
        <h3 class="font-archivo-black text-xl text-slate-900">${project.title}</h3>
        <p class="font-raleway text-sm text-slate-500 mt-0.5">${project.label}</p>
      </div>
      <p class="font-raleway text-sm text-slate-600 leading-relaxed">${project.description}</p>
      <div class="flex flex-col gap-3 lg:gap-1.5">
        ${tagGroupsHtml}
      </div>
    </div>
  </div>`
}

export function createExperienceSection(): string {
  const cards = projects.map((project) => createProjectCard(project)).join('\n    ')
  return `<div class="flex flex-col gap-6 py-2">
    ${cards}
  </div>`
}
