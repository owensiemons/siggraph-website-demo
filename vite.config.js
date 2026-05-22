import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  assetsInclude: ['**/*.txt'],
  assetsInclude: ['**/*.png'],
  plugins: [react()],
  base: '/siggraph-website-demo/', // TODO: change when we're updating the repo
})
