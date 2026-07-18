import { VUE_FILES } from '../utils';
import { vueRules } from './vue-rules';

import type { TypedFlatConfigItem } from '../types';

/**
 * Vue layer based on the official flat recommended preset.
 * Must spread the full array — it includes setup, processor, and rule packs.
 */
export async function vue(): Promise<TypedFlatConfigItem[]> {
  const vuePluginMod = await import('eslint-plugin-vue');
  const globalsMod = await import('globals');

  const vuePlugin = (vuePluginMod as any).default ?? vuePluginMod;
  const globals = (globalsMod as any).default ?? globalsMod;

  const recommended = (vuePlugin.configs?.['flat/recommended'] ?? []) as TypedFlatConfigItem[];

  return [
    ...recommended,
    {
      name: 'qstanay/vue/rules',
      files: [...VUE_FILES],
      languageOptions: {
        globals: {
          ...globals.browser,
        },
        parserOptions: {
          // Keep vue-eslint-parser as the root parser (from recommended),
          // and parse <script lang="ts"> with the TS parser.
          parser: {
            ts: '@typescript-eslint/parser',
            js: 'espree',
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
          extraFileExtensions: ['.vue'],
        },
      },
      rules: {
        ...vueRules(),
      },
    },
  ];
}
