import type { TypedFlatConfigItem } from '../types';

export async function typescript(): Promise<TypedFlatConfigItem[]> {
  const parserMod = await import('@typescript-eslint/parser');
  const pluginMod = await import('@typescript-eslint/eslint-plugin');

  const parser = (parserMod as any).default ?? parserMod;
  const plugin = (pluginMod as any).default ?? pluginMod;

  return [
    {
      name: 'qstanay/typescript',
      files: ['**/*.{ts,tsx,cts,mts,vue}'],
      languageOptions: {
        parser,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
        },
      },
      plugins: {
        '@typescript-eslint': plugin,
      },
      rules: {
        ...(plugin.configs?.recommended?.rules ?? {}),
      },
    },
  ];
}
