import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: replace <REPO_NAME> with your repository name for GH Pages.
export default defineConfig({
  plugins: [react()],
  base: '/<REPO_NAME>/'
})
