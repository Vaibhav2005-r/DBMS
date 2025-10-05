import { defineConfig, ConfigEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import sourceLocatorModule from '@metagptx/vite-plugin-source-locator';

// Vite plugin type-safe wrapper
const sourceLocator = sourceLocatorModule as unknown as () => Plugin;

export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    plugins: [
      react(),
      sourceLocator(), // call without arguments if the plugin expects none
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});