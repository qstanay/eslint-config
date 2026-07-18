import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    nuxt: 'src/nuxt.ts',
  },
  format: 'esm',
  clean: true,
  dts: true,
  target: 'es2022',
});
