import type { TypedFlatConfigItem } from '../types';

export function ignores(extraIgnores: string[] = []): TypedFlatConfigItem[] {
  return [
    {
      name: 'qstanay/ignores',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.output/**',
        '**/.nuxt/**',
        '**/.nitro/**',
        ...extraIgnores,
      ],
    },
  ];
}
