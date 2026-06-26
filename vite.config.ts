import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works on GitHub Pages project sites
  // (served from /<repo>/) without hardcoding the repo name.
  base: './',
  plugins: [react()],
})
