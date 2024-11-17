import { resolve } from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve('src/index.ts'),
      name: 'grapesjs-plugin-table',
      // the proper extensions will be added
      fileName: 'grapesjs-plugin-table'
    },
    minify: 'esbuild'
  },
})
