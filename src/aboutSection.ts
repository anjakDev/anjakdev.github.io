import coffeeIcon from './assets/coffee.svg'
import diamondIcon from './assets/diamond.svg'
import lightIcon from './assets/light.svg'

function createParagraphOne(): string {
  return `<div class="flex gap-4 items-start">
                <img src="${diamondIcon}" alt="" class="w-6 h-6 shrink-0 mt-1" />
                <p class="font-raleway text-md text-slate-600 leading-relaxed">
                  I want to build cool stuff that makes a positive impact and that is made so well it can survive all kinds of turbulence. 
                </p>
              </div>`
}

function createParagraphTwo(): string {
  return `<div class="flex gap-4 items-start">
                <img src="${lightIcon}" alt="" class="w-6 h-6 shrink-0 mt-1" />
                <p class="font-raleway text-md text-slate-600 leading-relaxed">
                  Every bug and every refactoring makes me a better developer, and I love trying new things almost as much as perfecting existing skills. 
                </p>
              </div>`
}

function createParagraphThree(): string {
  return `<div class="flex gap-4 items-start">
                <img src="${coffeeIcon}" alt="" class="w-6 h-6 shrink-0 mt-1" />
                <p class="font-raleway text-md text-slate-600 leading-relaxed">
                  My day never has enough hours to fit in all the things I love doing, but if I have enough cups of coffee, a good gym session and a good playlist, I am always bound to have a day to be proud of. 
                </p>
              </div>`
}

export function createAboutSection(): string {
  return `
    <div class="flex flex-col lg:flex-row gap-0">
      <!-- Content Area -->
      <div class="w-full lg:w-2/3 bg-cream py-16 px-6">
        <div class="max-w-4xl mx-auto">
          <!-- About Me Content -->
          <div class="section-content active" data-section="about">
            <div class="space-y-4">
              ${createParagraphOne()}
              ${createParagraphTwo()}
              ${createParagraphThree()}
            </div>
          </div>

          <!-- Experience Content -->
          <div class="section-content hidden" data-section="experience">
            <p class="font-raleway text-md text-slate-600 leading-relaxed">This section will contain information about the projects I have worked on. However, it is still a work in progress.</p>
          </div>

          <!-- Skills Content -->
          <div class="section-content hidden" data-section="skills">
            <p class="font-raleway text-md text-slate-600 leading-relaxed">This section will contain information about my skills. However, it is still a work in progress.</p>
          </div>
        </div>
      </div>
    </div>

    
    `
}
