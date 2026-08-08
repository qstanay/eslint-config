import type { TypedFlatConfigItem } from '../types';

export const TEST_FILES = [
  '**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}',
  '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx,cts,mts}',
  '**/tests/**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}',
  '**/test/**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}',
] as const;

/**
 * Vitest layer: recommended rules + test globals for common test globs.
 */
export async function test(): Promise<TypedFlatConfigItem[]> {
  const mod = await import('@vitest/eslint-plugin');
  const vitest = (mod as any).default ?? mod;
  const globalsMod = await import('globals');
  const globals = (globalsMod as any).default ?? globalsMod;

  const recommended = vitest.configs?.recommended ?? {};
  const env = vitest.configs?.env ?? {};

  return [
    {
      name: 'qstanay/test',
      files: [...TEST_FILES],
      plugins: {
        vitest,
      },
      languageOptions: {
        globals: {
          ...globals.vitest,
          ...(env.languageOptions?.globals ?? {}),
        },
      },
      rules: {
        ...(recommended.rules ?? {}),
      },
    },
  ];
}
