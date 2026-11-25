import coffeeIcon from './assets/coffee.svg'
import diamondIcon from './assets/diamond.svg'
import lightIcon from './assets/light.svg'
import { createExperienceSection } from './experienceSection'
import { SECTIONS, type SectionId } from './menuSection'
import { createSkillsSection } from './skillsSection'

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

function createAboutBody(): string {
  return `<div class="space-y-4">
            ${createParagraphOne()}
            ${createParagraphTwo()}
            ${createParagraphThree()}
          </div>`
}

export function createAboutSection(): string {
  const bodies: Record<SectionId, string> = {
    about: createAboutBody(),
    experience: createExperienceSection(),
    skills: createSkillsSection(),
  }
  const sections = SECTIONS.map(
    ({ id, label }) => `
        <section id="${id}" class="scroll-mt-12">
          <h2 class="font-archivo-black text-3xl mb-6">${label}</h2>
          ${bodies[id]}
        </section>`,
  ).join('')

  return `
    <div class="w-full py-16 px-6 lg:px-12">
      <div class="max-w-4xl flex flex-col gap-20">${sections}
      </div>
    </div>
  `
}
