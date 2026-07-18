import type { TypedFlatConfigItem } from '../types';

export async function nuxt(): Promise<TypedFlatConfigItem[]> {
  const mod = await import('@nuxt/eslint-plugin');
  const plugin = (mod as any).default ?? mod;

  return [
    {
      name: 'qstanay/nuxt',
      plugins: {
        nuxt: plugin,
      },
      rules: {
        // keep this minimal; Nuxt base config already provides most of it
        'nuxt/prefer-import-meta': 'error',
      },
    },
  ];
}
