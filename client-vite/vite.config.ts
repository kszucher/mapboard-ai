import { defineConfig } from 'vite'
import type { UserConfig as VitestUserConfigInterface } from 'vitest/config';

import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import viteReact from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), viteBasicSslPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    host: 'local.mapboard',
    https: true,
  },
})
