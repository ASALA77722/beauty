import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Deux modes :
//  - `npm run build`      → build classique servie par un serveur
//  - `npm run build:file` → fichier HTML unique (offline) à ouvrir directement
export default defineConfig(() => {
  const singleFile = process.env.SINGLE_FILE === '1'
  return {
    plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
    // chemin public : « /Beaut-/ » sur GitHub Pages, relatif pour le fichier autonome
    base: process.env.PAGES_BASE || './',
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: true,
    },
    build: singleFile
      ? { outDir: 'dist-file', cssCodeSplit: false, assetsInlineLimit: 100000000 }
      : { outDir: 'dist' },
  }
})
