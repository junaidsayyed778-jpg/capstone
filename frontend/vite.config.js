import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), 'VITE_')
  const sandboxApiTarget = env.VITE_API_SANDBOX_TARGET || 'http://localhost:3000'
  const aiApiTarget = env.VITE_API_AI_TARGET || 'http://localhost:3001'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      cors: {
        origin: /^http:\/\/localhost(:\d+)?$/,
      },
      proxy: {
        "/api/sandbox": {
          target: sandboxApiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api/ai": {
          target: aiApiTarget,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})
