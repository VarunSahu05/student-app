import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    //allowedHosts: ['61d2-2409-40c4-3c-6604-5890-4df8-9247-99fd.ngrok-free.app'],
    //host:'0.0.0.0'
  }
})

