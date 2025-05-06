import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    //allowedHosts:['9650-2409-40c4-10b1-6d2f-c456-740f-f50d-ceb9.ngrok-free.app'],
    host:'0.0.0.0'
  }
})
