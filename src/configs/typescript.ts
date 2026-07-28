import { TYPESCRIPT_FILES, VUE_FILES } from '../utils';

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

export async function loadTypescriptPlugin() {
  const pluginMod = await import('@typescript-eslint/eslint-plugin');
  return (pluginMod as any).default ?? pluginMod;
}

/**
 * TypeScript layer.
 *
 * Important: `@typescript-eslint/parser` is never the root parser for `.vue`.
 * Vue SFCs keep `vue-eslint-parser` as root (from the Vue layer) and use the
 * TS parser only as a nested script parser.
 *
 * Flat config requires the plugin on every object that references
 * `@typescript-eslint/*` rules (see shared-rules / overrides too).
 */
export async function typescript(options: {
  vue?: boolean;
} = {}): Promise<TypedFlatConfigItem[]> {
  const parserMod = await import('@typescript-eslint/parser');
  const plugin = await loadTypescriptPlugin();
  const parser = (parserMod as any).default ?? parserMod;

  const recommended = (plugin.configs?.['flat/recommended'] ?? []) as TypedFlatConfigItem[];
  const rules = collectRules(recommended);

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'qstanay/typescript',
      files: [...TYPESCRIPT_FILES],
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
      rules,
    },
  ];

  if (options.vue) {
    configs.push({
      name: 'qstanay/typescript/vue-rules',
      files: [...VUE_FILES],
      plugins: {
        '@typescript-eslint': plugin,
      },
      rules,
    });
  }

  return configs;
}
