import type { Linter } from 'eslint';

export function vueRules(): Linter.RulesRecord {
  return {
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
    'vue/padding-line-between-tags': [
      'error',
      [
        {
          blankLine: 'always',
          prev: '*',
          next: '*',
        },
      ],
    ],
  };
}
