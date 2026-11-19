import { defineConfig } from '@playwright/test'

const publicado = process.env.JARDIN_URL
export default defineConfig({
  testDir: './tests',
  use: { baseURL: publicado || 'http://127.0.0.1:4173' },
  webServer: publicado ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
  },
  projects: [
    {name:'Escritorio',use:{viewport:{width:1280,height:850},colorScheme:'light'}},
    {name:'Móvil',use:{viewport:{width:320,height:720},colorScheme:'dark',hasTouch:true,reducedMotion:'reduce'}},
  ],
})
