import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types';

import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { has, resolveEnabled } from './utils';
import { ignores } from './configs/ignores';
import { sharedRules } from './configs/shared-rules';
import { imports } from './configs/imports';
import { nuxt as nuxtConfig } from './configs/nuxt';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { typescript as typescriptConfig } from './configs/typescript';
import { vue as vueConfig } from './configs/vue';

export { nuxt } from './nuxt';
export * from './types';

export function defineConfig(
  options: OptionsConfig = {},
  ...userConfigs: (Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>)[]
) {
  const enableTs = resolveEnabled(options.typescript, has('typescript'));
  const enableVue = resolveEnabled(options.vue, has('vue') || has('nuxt'));
  const enableNuxt = resolveEnabled(options.nuxt, has('nuxt'));

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  const configs: (Awaitable<TypedFlatConfigItem[]>)[] = [];

  configs.push(Promise.resolve(ignores(options.ignores)));

  if (enableTs) {
    configs.push(typescriptConfig());
  }

  configs.push(imports());

  if (stylisticOptions) {
    configs.push(stylisticConfig(stylisticOptions));
  }

  if (enableVue) {
    configs.push(vueConfig());
  }

  if (enableNuxt) {
    configs.push(nuxtConfig());
  }

  configs.push(Promise.resolve([
    {
      name: 'qstanay/shared-rules',
      rules: {
        ...sharedRules(),
        ...(options.overrides ?? {}),
      },
      files: ['**/*.{js,jsx,ts,tsx,cts,mts,vue}'],
    },
  ]));

  const composer = new FlatConfigComposer<TypedFlatConfigItem>();
  composer.append(...configs, ...userConfigs as any);
  return composer;
}
