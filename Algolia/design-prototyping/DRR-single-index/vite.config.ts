import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production and `vite preview` use the subpath (Vercel). Plain `vite` dev uses `/` so
// http://localhost:5173/ works without remembering the nested URL.
export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'serve' && mode === 'development' ? '/' : '/DRR-single-index/',
  build: {
    outDir: '../dist/DRR-single-index',
  },
}))
