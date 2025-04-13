import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl(), svgr()],
  test: {
    globals: true,
  },
  server: {
    port: 5174,
    host: 'local.mapboard'
  },
})
