import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
// server: {
//     port: 3001, // Specify the port here
// https: {
//       key: fs.readFileSync('/etc/letsencrypt/live/eeu.pdn.ac.lk/privkey.pem'),
//       cert: fs.readFileSync('/etc/letsencrypt/live/eeu.pdn.ac.lk/fullchain.pem')
//     }
//   },
})
