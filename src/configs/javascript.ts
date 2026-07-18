import type { TypedFlatConfigItem } from '../types';

/**
 * Base JS quality rules from `@eslint/js` recommended.
 */
export async function javascript(): Promise<TypedFlatConfigItem[]> {
  const mod = await import('@eslint/js');
  const js = (mod as any).default ?? mod;

  return [
    {
      name: 'qstanay/javascript',
      rules: {
        ...(js.configs?.recommended?.rules ?? {}),
      },
    },
  ];
}
