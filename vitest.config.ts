import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import baseConfig from './vite.config';

export default defineConfig({
  define: baseConfig.define,
  test: {
    setupFiles: [resolve(__dirname, 'tests/bootstrap.ts')],
    watch: false,
  },
});
