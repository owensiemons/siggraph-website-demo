import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/siggraph-website-demo/', // TODO: change when we're updating the repo
})
