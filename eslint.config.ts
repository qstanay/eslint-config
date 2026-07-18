import { defineConfig } from './src/index';

export default defineConfig({
  typescript: true,
  vue: false,
  nuxt: false,
  ignores: ['test/fixtures/**'],
  overrides: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
  },
});
