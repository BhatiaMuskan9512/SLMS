import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Port Selection: Standard for Vite is 5173
    port: 5173,
    
    // 2. Strict Port: If 5173 is busy, fail instead of picking a random one
    // This ensures your Firebase/Google Auth redirect URLs don't break.
    strictPort: true,

    // 3. Proxy (Optional but used in some video versions):
    // This allows you to use '/api' in axios instead of the full URL.
    /*
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    */
  },
  // 4. Build Optimization: Ensures the final JS/CSS is minified and fast.
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})