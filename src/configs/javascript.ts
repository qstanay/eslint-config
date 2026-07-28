import type { TypedFlatConfigItem } from '../types';

/**
 * Base JS quality rules from `@eslint/js` recommended.
 * Declares Node + ES2022 globals so `no-undef` does not false-positive on
 * `console`, `process`, and other built-ins.
 * When `browser` is true (Vue apps), also declare browser globals for entry
 * files outside `.vue` SFCs (`main.js`, `app.ts`, etc.).
 */
export async function javascript(options: {
  browser?: boolean;
} = {}): Promise<TypedFlatConfigItem[]> {
  const jsMod = await import('@eslint/js');
  const globalsMod = await import('globals');

  const js = (jsMod as any).default ?? jsMod;
  const globals = (globalsMod as any).default ?? globalsMod;

  return [
    {
      name: 'qstanay/javascript',
      languageOptions: {
        globals: {
          ...globals.es2022,
          ...globals.nodeBuiltin,
          ...(options.browser ? globals.browser : {}),
        },
      },
      rules: {
        ...(js.configs?.recommended?.rules ?? {}),
      },
    },
  ];
}
