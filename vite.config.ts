import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: "src",
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'scripts/katex', 
          dest: 'scripts' 
        },
        {
          src: 'scripts/pdfjs', 
          dest: 'scripts' 
        },
        {
          src: 'external', 
          dest: '.' 
        }
      ]
    })
  ],
  build: {
    outDir: "../deploy",
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      },
      input: {
        main: 'src/index.html',
        dashboard: 'src/dashboard.html',
        fileviewer: 'src/fileviewer.html',
        forgot: 'src/forgot.html',
        login: 'src/login.html',
        new: 'src/new.html',
        result: 'src/result.html',
        room_control: 'src/room/control.html',
        room_resource: 'src/room/resource.html'
      },
    },
    emptyOutDir: true
  },
})