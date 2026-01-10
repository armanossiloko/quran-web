import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    // Update this base path to match your GitHub repository name
    // For example, if your repo is "my-quran-app", change it to '/my-quran-app/'
    // For user/organization pages (username.github.io), use '/'
    base: mode === 'production' ? '/Quran/' : '/',
  }
})

