import path from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { DEFAULT_API_BASE_URL } from './src/shared/config/api-default.ts'

function apiPreconnect(apiBaseUrl: string): Plugin {
  return {
    name: 'api-preconnect',
    transformIndexHtml: () => [
      {
        tag: 'link',
        attrs: { rel: 'preconnect', href: new URL(apiBaseUrl).origin, crossorigin: '' },
        injectTo: 'head',
      },
    ],
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiBaseUrl = env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

  return {
    plugins: [react(), tailwindcss(), apiPreconnect(apiBaseUrl)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'router', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
              { name: 'query', test: /node_modules[\\/]@tanstack[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
