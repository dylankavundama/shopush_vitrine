import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Déployé sous https://shopushindi.com/shop/
export default defineConfig({
  base: '/shop/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
