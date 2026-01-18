import profileImage from './assets/profile.webp'

export function createImageCard(): string {
  return `
    <div class="relative shrink-0 lg:mt-32 lg:mr-42">
      <div class="w-40 h-40 lg:w-48 lg:h-48 rounded-lg bg-linear-to-r from-gradient-cyan to-gradient-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shimmer-on-hover"></div>
      <div class="w-36 h-36 lg:w-44 lg:h-44 rounded-lg bg-cream absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <img src="${profileImage}" alt="Anja Klipic" class="w-32 h-32 lg:w-40 lg:h-40 rounded-lg relative" />
    </div>
  `
}
