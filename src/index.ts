import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { ignores } from './configs/ignores';
import { imports } from './configs/imports';
import { javascript as javascriptConfig } from './configs/javascript';
import { nuxt as nuxtConfig } from './configs/nuxt';
import { sharedRules } from './configs/shared-rules';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { typescript as typescriptConfig } from './configs/typescript';
import { vue as vueConfig } from './configs/vue';
import {
  has,
  resolveEnabled,
  resolveStylisticOptions,
  sourceFiles,
  VUE_FILES,
} from './utils';

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
  const files = sourceFiles(enableVue);

  const configs: (Awaitable<TypedFlatConfigItem[]>)[] = [];

  // When Vue is off, skip SFCs entirely so espree/TS do not fatal-parse them.
  configs.push(Promise.resolve(ignores([
    ...(options.ignores ?? []),
    ...(!enableVue ? VUE_FILES : []),
  ])));
  configs.push(javascriptConfig());

  if (enableTs) {
    configs.push(typescriptConfig({ vue: enableVue }));
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
      files,
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
        files,
        rules: options.overrides,
      },
    ]));
  }

  const composer = new FlatConfigComposer<TypedFlatConfigItem>();
  composer.append(...configs, ...userConfigs as any);
  return composer;
}
