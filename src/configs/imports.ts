import type { TypedFlatConfigItem } from '../types';

export async function imports(): Promise<TypedFlatConfigItem[]> {
  const mod = await import('eslint-plugin-import-x');
  const plugin = (mod as any).default ?? mod;

  return [
    {
      name: 'qstanay/imports',
      plugins: {
        import: plugin,
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/order': [
          'error',
          {
            'groups': [
              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'object',
              'type',
            ],
            'newlines-between': 'always',
            'alphabetize': {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
  ];
}
