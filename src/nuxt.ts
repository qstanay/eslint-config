import { ignores } from './configs/ignores';
import {
  javascriptRules,
  typescriptRules,
} from './configs/shared-rules';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { test as testConfig } from './configs/test';
import { vueRules } from './configs/vue-rules';
import {
  has,
  resolveEnabled,
  resolveStylisticOptions,
  SOURCE_FILES,
  TYPESCRIPT_FILES,
  VUE_FILES,
} from './utils';

import type { StylisticOptions, TypedFlatConfigItem } from './types';
import type { Linter } from 'eslint';

export interface NuxtPresetOptions {
  stylistic?: boolean | StylisticOptions;
  /**
   * Enable stricter opinionated TypeScript rules (e.g. `no-magic-numbers`).
   */
  strict?: boolean;
  /**
   * Enable Vitest rules/globals for test files.
   * Auto-enabled when `vitest` is installed unless explicitly set.
   */
  test?: boolean;
  overrides?: Linter.RulesRecord;
  /**
   * Extra ignores appended to defaults / `.gitignore`.
   */
  ignores?: string[];
}

/**
 * Opinionated layer for Nuxt apps.
 *
 * Intended to be used with `@nuxt/eslint` + `withNuxt()`:
 * Nuxt already provides TypeScript/Vue/import plugins, so this preset
 * only adds stylistic formatting and shared opinionated rules.
 */
export function nuxt(options: NuxtPresetOptions = {}) {
  const stylisticOptions = resolveStylisticOptions(options.stylistic);
  const enableTest = resolveEnabled(options.test, has('vitest'));
  const vueIndent = stylisticOptions
    ? (stylisticOptions.indent ?? 2)
    : undefined;

  const configs: Promise<TypedFlatConfigItem[]>[] = [
    Promise.resolve(ignores(options.ignores)),
  ];

  if (stylisticOptions) {
    configs.push(stylisticConfig(stylisticOptions));
  }

  if (enableTest) {
    configs.push(testConfig());
  }

  // Rules only — do not register `@typescript-eslint` / `vue`.
  // `@nuxt/eslint` already provides those plugins; a second instance
  // (common with pnpm) makes ESLint reject the config.
  configs.push(Promise.resolve([
    {
      name: 'qstanay/nuxt/shared-rules',
      files: [...SOURCE_FILES],
      rules: javascriptRules(),
    },
    {
      name: 'qstanay/nuxt/shared-rules/typescript',
      files: [...TYPESCRIPT_FILES, ...VUE_FILES],
      rules: typescriptRules({ strict: options.strict }),
    },
    {
      name: 'qstanay/nuxt/vue-rules',
      files: [...VUE_FILES],
      rules: {
        ...vueRules({ indent: vueIndent }),
      },
    },
  ]));

  if (options.overrides) {
    // Dedicated trailing block so overrides always win over vue/shared rules.
    configs.push(Promise.resolve([
      {
        name: 'qstanay/nuxt/overrides',
        files: [...SOURCE_FILES],
        rules: options.overrides,
      },
    ]));
  }

  return configs;
}
