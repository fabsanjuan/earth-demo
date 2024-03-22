import vitePluginString from 'vite-plugin-string';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vitePluginString()
    ],
    root: './',
    base: '/earth-demo/',
})
