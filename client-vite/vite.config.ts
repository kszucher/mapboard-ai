import { defineConfig } from 'vite'
import type { UserConfig as VitestUserConfigInterface } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite'

import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import viteReact from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteReact(), viteBasicSslPlugin(),
    AutoImport({
      imports: ['vitest'],
      dts: true, // generate TypeScript declaration
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },

  server: {
    host: 'local.mapboard',
    https: true,
  },
})
