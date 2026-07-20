import { typescriptFiles } from '../utils';

import type { TypedFlatConfigItem } from '../types';
import type { Linter } from 'eslint';

function collectRules(configs: TypedFlatConfigItem[]): Linter.RulesRecord {
  return Object.assign(
    {},
    ...configs
      .filter(config => config.rules)
      .map(config => config.rules),
  );
}

export async function typescript(options: {
  vue?: boolean;
} = {}): Promise<TypedFlatConfigItem[]> {
  const parserMod = await import('@typescript-eslint/parser');
  const pluginMod = await import('@typescript-eslint/eslint-plugin');

  const parser = (parserMod as any).default ?? parserMod;
  const plugin = (pluginMod as any).default ?? pluginMod;

  const recommended = (plugin.configs?.['flat/recommended'] ?? []) as TypedFlatConfigItem[];
  const vueEnabled = options.vue === true;

  return [
    {
      name: 'qstanay/typescript',
      files: typescriptFiles(vueEnabled),
      languageOptions: {
        parser,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          ...(vueEnabled
            ? { extraFileExtensions: ['.vue'] }
            : {}),
        },
      },
      plugins: {
        '@typescript-eslint': plugin,
      },
      rules: collectRules(recommended),
    },
  ];
}
