import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'Frontend',
  envDir: '..',
  publicDir: 'static',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss({ content: [resolve('Frontend/src/**/*.{js,jsx}')] }), autoprefixer()],
    },
  },
  server: { proxy: { '/api': 'http://127.0.0.1:' + (process.env.PORT || 3000) } },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        portfolio: resolve('Frontend/index.html'),
        resume: resolve('Frontend/resume.html'),
        profile: resolve('Frontend/prajwal-pradhan.html'),
      },
    },
  },
})
