import type { TypedFlatConfigItem } from '../types';

import gitignore from 'eslint-config-flat-gitignore';

export function ignores(extraIgnores: string[] = []): TypedFlatConfigItem[] {
  return [
    // Prefer project .gitignore when present; do not fail if missing.
    gitignore({ strict: false }),
    {
      name: 'qstanay/ignores',
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.output/**',
        '**/.nuxt/**',
        '**/.nitro/**',
        '**/coverage/**',
        ...extraIgnores,
      ],
    },
  ];
}
