export function createMenuSection(): string {
  return `
      <!-- Sidebar Menu -->
        <div class="hidden lg:flex py-16 px-6 flex-col gap-4 justify-start items-end">
            <h3 class="font-archivo-black text-2xl text-cream cursor-pointer menu-title active" data-section="about">About Me</h3>
            <h3 class="font-archivo-black text-2xl text-cream cursor-pointer menu-title" data-section="experience">Experience</h3>
            <h3 class="font-archivo-black text-2xl text-cream cursor-pointer menu-title" data-section="skills">Skills</h3>
        </div>
      `
}
