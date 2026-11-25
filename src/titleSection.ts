export function createSidebarBadge(): string {
  return `
    <a href="#top" aria-label="Back to top"
       class="w-14 h-14 rounded-full bg-cream text-slate-900 flex items-center justify-center font-archivo-black text-lg shadow-sm">AS</a>
  `;
}

export function createHero(): string {
  return `
    <div class="flex flex-col gap-6 min-w-0">
      <p class="font-mono text-xs text-slate-600">
        ~/anja · software engineer · <span class="text-emerald-700">● building</span>
      </p>
      <h1 class="font-archivo-black text-6xl sm:text-7xl lg:text-[clamp(4.5rem,8vw,120px)] leading-[0.9]">
        Anja<br />
        <span class="name-highlight">Sperber</span>
      </h1>
      <p class="font-raleway text-xl lg:text-2xl text-slate-700 leading-snug max-w-xl">
        I build software that makes a positive impact and is made well enough to survive all kinds of turbulence.
      </p>
    </div>
  `;
}
