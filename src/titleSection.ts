export function createSideBarTitle(): string {
  return `
  <div class="hidden lg:flex flex-col items-end lg:h-1/2">
          <h1 class="font-archivo-black text-5xl lg:text-88 font-bold mb-4 px-6 pt-32 text-cream">Anja</h1>
          <p class="font-archivo-black text-lg lg:text-20 text-cream mb-8 px-6">Software Engineer</p>
        </div>
  `

}

export function createMainBarTitle(): string {
  return `
      <h1 class="font-archivo-black text-5xl lg:text-88 font-bold mb-4 pt-32">
        <span class="bg-linear-to-r from-gradient-cyan to-gradient-yellow bg-clip-text text-transparent">Klipic</span>
      </h1>
  `
}
