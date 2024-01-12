import path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        port: 80,
        host: '0.0.0.0',
        /*proxy: {
            '/api': {
                target: process.env.VITE_SERVICE_BASE_URL,
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/amap': {
                target: 'https://restapi.amap.com/v3/geocode/',
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/amap/, '')
            },
        },*/
    },
    css: {
        preprocessorOptions: {
            scss: {
                // 两种方式都可以
                additionalData: '@import "@/assets/scss/global.scss";'
                // additionalData: '@use "@/assets/scss/global.scss" as *;'
            }
        }
    },
    plugins: [vue()],
})
