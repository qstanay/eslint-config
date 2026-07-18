import type { StylisticOptions, TypedFlatConfigItem } from './types';

import { sharedRules } from './configs/shared-rules';
import { imports } from './configs/imports';
import { nuxt as nuxtConfig } from './configs/nuxt';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { typescript as typescriptConfig } from './configs/typescript';
import { vue as vueConfig } from './configs/vue';

export interface NuxtPresetOptions {
  stylistic?: boolean | StylisticOptions;
  overrides?: Record<string, unknown>;
}

export function nuxt(options: NuxtPresetOptions = {}) {
  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  const configs: Promise<TypedFlatConfigItem[]>[] = [
    typescriptConfig(),
    imports(),
    vueConfig(),
    nuxtConfig(),
    Promise.resolve([
      {
        name: 'qstanay/nuxt/shared-rules',
        files: ['**/*.{js,jsx,ts,tsx,cts,mts,vue}'],
        rules: {
          ...sharedRules(),
        },
      },
    ]),
  ];

  if (stylisticOptions) {
    configs.unshift(stylisticConfig(stylisticOptions));
  }

  return configs;
}
