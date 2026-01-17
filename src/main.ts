import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="min-h-screen flex flex-col lg:flex-row">
    <div class="w-full h-48 lg:w-1/3 lg:h-screen bg-linear-to-r from-gradient-cyan to-gradient-yellow"></div>
    <div class="w-full lg:w-2/3 bg-cream text-slate-900">
      <div class="max-w-4xl mx-auto px-6 pb-20">
        <h1 class="font-archivo-black text-5xl lg:text-88 font-bold mb-4 pt-8 lg:pt-32 lg:-translate-x-[38.8%] text-cream">Anja <span class="bg-linear-to-r from-gradient-cyan to-gradient-yellow bg-clip-text text-transparent">Klipic</span></h1>
        <p class="font-archivo-black text-lg lg:text-20 lg:-translate-x-[38.8%] text-cream mb-8">Software Engineer</p>
      </div>
    </div>
  </div>
`
