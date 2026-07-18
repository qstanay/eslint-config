import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { ignores } from './configs/ignores';
import { imports } from './configs/imports';
import { javascript as javascriptConfig } from './configs/javascript';
import { nuxt as nuxtConfig } from './configs/nuxt';
import { sharedRules } from './configs/shared-rules';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { typescript as typescriptConfig } from './configs/typescript';
import { vue as vueConfig } from './configs/vue';
import { has, resolveEnabled, resolveStylisticOptions, SOURCE_FILES } from './utils';

import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types';

export { nuxt } from './nuxt';
export * from './types';

export function defineConfig(
  options: OptionsConfig = {},
  ...userConfigs: (Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>)[]
) {
  const enableTs = resolveEnabled(options.typescript, has('typescript'));
  const enableVue = resolveEnabled(options.vue, has('vue') || has('nuxt'));
  const enableNuxt = resolveEnabled(options.nuxt, has('nuxt'));
  const stylisticOptions = resolveStylisticOptions(options.stylistic);

  const configs: (Awaitable<TypedFlatConfigItem[]>)[] = [];

  configs.push(Promise.resolve(ignores(options.ignores)));
  configs.push(javascriptConfig());

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
      files: [...SOURCE_FILES],
      rules: sharedRules({
        typescript: enableTs,
        strict: options.strict,
      }),
    },
  ]));

  if (options.overrides) {
    // Trailing block so project overrides win over shared/vue/ts packs.
    configs.push(Promise.resolve([
      {
        name: 'qstanay/overrides',
        files: [...SOURCE_FILES],
        rules: options.overrides,
      },
    ]));
  }

  const composer = new FlatConfigComposer<TypedFlatConfigItem>();
  composer.append(...configs, ...userConfigs as any);
  return composer;
}
