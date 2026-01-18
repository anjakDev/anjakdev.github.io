import { createAboutSection } from './aboutSection'
import { createImageCard } from './imageCard'
import { createMenuSection } from './menuSection'
import './style.css'
import { createMainBarTitle, createSideBarTitle } from './titleSection'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="flex flex-col lg:flex-row lg:min-h-screen">
    <!-- Sidebar Gradient -->
    <div class="w-full h-48 lg:w-1/3 lg:min-h-screen bg-linear-to-r from-gradient-cyan to-gradient-yellow flex flex-col">
      ${createSideBarTitle()}
      <div class="w-full ">${createMenuSection()}</div>
    </div>
    
    <!-- Main Content Area -->
    <div class="w-full lg:w-2/3 lg:min-h-screen bg-cream text-slate-900 flex flex-col">
      <!-- Top Half: Hero Section -->
      <div class="flex flex-col lg:h-1/2 lg:flex-row lg:items-start lg:justify-between">
        ${createMainBarTitle()}
        
        ${createImageCard()}
      </div>
      
      <!-- Bottom Half: About Section -->
      ${createAboutSection()}
    </div>
  </div>
`

// Menu hover handlers
document.querySelectorAll('.menu-title').forEach((title) => {
  title.addEventListener('mouseenter', function (this: HTMLElement) {
    const section = (this as HTMLElement).getAttribute('data-section');

    // Update active menu title
    document.querySelectorAll('.menu-title').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    // Update active content
    document.querySelectorAll('.section-content').forEach(content => {
      content.classList.add('hidden');
    });
    const activeContent = document.querySelector('[data-section="' + section + '"].section-content');
    if (activeContent) {
      activeContent.classList.remove('hidden');
    }
  });
});
