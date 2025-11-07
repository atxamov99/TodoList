import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Note: the project previously attempted to import '@tailwindcss/vite',
// which is not a standard package and caused build failures on Vercel.
// Tailwind doesn't require a Vite plugin — it's normally run via PostCSS.
// If you do want a dedicated plugin, install it explicitly. For now we
// keep the React plugin only so the build won't fail.
export default defineConfig({
  plugins: [react()],
})