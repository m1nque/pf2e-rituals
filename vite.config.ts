import { defineConfig } from 'vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// Foundry 데이터 경로 - 개발 환경에 맞게 수정하세요
const FOUNDRY_DATA_PATH = process.env.FOUNDRY_DATA_PATH || '/path/to/your/foundry/data';
const MODULE_NAME = 'pf2e-rituals';
const MODULE_PATH = `${FOUNDRY_DATA_PATH}/Data/modules/${MODULE_NAME}`;

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    root: 'src/',
    base: '/',
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.ts'),
        },
        output: {
          entryFileNames: 'scripts/[name].js',
          chunkFileNames: 'scripts/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    plugins: [
      nodeResolve(),
      viteStaticCopy({
        targets: [
          {
            src: 'module.json',
            dest: './',
          },
          {
            src: 'static/languages/*',
            dest: 'languages/',
          },
          {
            src: 'static/assets/**/*',
            dest: 'assets/',
          },
          {
            src: 'src/templates/**/*',
            dest: 'templates/',
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: isDev
      ? {
          port: 30001,
          open: false,
          proxy: {
            // 프록시 설정 - 개발할 때 사용
            [`/${MODULE_NAME}`]: {
              target: `http://localhost:30000`,
              ws: true,
            },
          },
        }
      : undefined,
  };
});