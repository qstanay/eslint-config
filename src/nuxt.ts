import type { Linter } from 'eslint';

import type { StylisticOptions, TypedFlatConfigItem } from './types';

import { sharedRules } from './configs/shared-rules';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { vueRules } from './configs/vue-rules';
import { resolveStylisticOptions, SOURCE_FILES, VUE_FILES } from './utils';

export interface NuxtPresetOptions {
  stylistic?: boolean | StylisticOptions;
  overrides?: Linter.RulesRecord;
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
  const configs: Promise<TypedFlatConfigItem[]>[] = [];

  if (stylisticOptions) {
    configs.push(stylisticConfig(stylisticOptions));
  }

  configs.push(Promise.resolve([
    {
      name: 'qstanay/nuxt/shared-rules',
      files: [...SOURCE_FILES],
      // Host (@nuxt/eslint) registers @typescript-eslint; include TS rules.
      rules: sharedRules({ typescript: true }),
    },
    {
      name: 'qstanay/nuxt/vue-rules',
      files: [...VUE_FILES],
      rules: {
        ...vueRules(),
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
