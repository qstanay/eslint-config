import type { TypedFlatConfigItem } from '../types';

export async function vue(): Promise<TypedFlatConfigItem[]> {
  const vuePluginMod = await import('eslint-plugin-vue');
  const vueParserMod = await import('vue-eslint-parser');

  const vuePlugin = (vuePluginMod as any).default ?? vuePluginMod;
  const vueParser = (vueParserMod as any).default ?? vueParserMod;

  return [
    {
      name: 'qstanay/vue',
      files: ['**/*.vue'],
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          parser: {
            ts: '@typescript-eslint/parser',
            js: 'espree',
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
          extraFileExtensions: ['.vue'],
        },
      },
      plugins: {
        vue: vuePlugin,
      },
      rules: {
        ...(vuePlugin.configs?.['flat/recommended']?.[0]?.rules ?? {}),
        'vue/html-self-closing': [
          'error',
          {
            html: {
              void: 'always',
              normal: 'always',
              component: 'always',
            },
            svg: 'always',
            math: 'always',
          },
        ],
        'vue/attributes-order': 'error',
        'vue/padding-line-between-tags': 'error',
      },
    },
  ];
}
