import { defineConfig } from './dist/index.mjs';

export default defineConfig({
  typescript: true,
  vue: false,
  nuxt: false,
  ignores: ['test/fixtures/**'],
  overrides: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
