import type { Linter } from 'eslint';

export function vueRules(options: {
  indent?: 2 | 4;
} = {}): Linter.RulesRecord {
  const rules: Linter.RulesRecord = {
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

  if (options.indent !== undefined) {
    // Keep template indent in sync with @stylistic script indent.
    rules['vue/html-indent'] = ['error', options.indent];
  }

  return rules;
}
