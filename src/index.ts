import { FlatConfigComposer } from 'eslint-flat-config-utils';

import { ignores } from './configs/ignores';
import { imports } from './configs/imports';
import { javascript as javascriptConfig } from './configs/javascript';
import { nuxt as nuxtConfig } from './configs/nuxt';
import {
  javascriptRules,
  typescriptRules,
} from './configs/shared-rules';
import { stylistic as stylisticConfig } from './configs/stylistic';
import { test as testConfig } from './configs/test';
import {
  loadTypescriptPlugin,
  typescript as typescriptConfig,
} from './configs/typescript';
import { vue as vueConfig } from './configs/vue';
import {
  has,
  resolveEnabled,
  resolveStylisticOptions,
  sourceFiles,
  TYPESCRIPT_FILES,
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
  const enableTest = resolveEnabled(options.test, has('vitest'));
  const stylisticOptions = resolveStylisticOptions(options.stylistic);
  const files = sourceFiles(enableVue);
  const vueIndent = stylisticOptions
    ? (stylisticOptions.indent ?? 2)
    : undefined;

  const configs: (Awaitable<TypedFlatConfigItem[]>)[] = [];

  // When Vue is off, skip SFCs entirely so espree/TS do not fatal-parse them.
  configs.push(Promise.resolve(ignores([
    ...(options.ignores ?? []),
    ...(!enableVue ? VUE_FILES : []),
  ])));
  configs.push(javascriptConfig({ browser: enableVue }));

  if (enableTs) {
    configs.push(typescriptConfig({ vue: enableVue }));
  }

  configs.push(imports());

  if (stylisticOptions) {
    configs.push(stylisticConfig(stylisticOptions));
  }

  if (enableVue) {
    configs.push(vueConfig({ indent: vueIndent }));
  }

  if (enableNuxt) {
    configs.push(nuxtConfig());
  }

  if (enableTest) {
    configs.push(testConfig());
  }

  configs.push(Promise.resolve([
    {
      name: 'qstanay/shared-rules',
      files,
      rules: javascriptRules(),
    },
  ]));

  if (enableTs) {
    // TS opinionated rules only on TS sources (+ .vue when Vue is on).
    // Never apply them to plain JS/MJS — that needs type-aware parser services.
    configs.push((async () => {
      const plugin = await loadTypescriptPlugin();
      return [
        {
          name: 'qstanay/shared-rules/typescript',
          files: enableVue
            ? [...TYPESCRIPT_FILES, ...VUE_FILES]
            : [...TYPESCRIPT_FILES],
          plugins: {
            '@typescript-eslint': plugin,
          },
          rules: typescriptRules({ strict: options.strict }),
        },
      ];
    })());
  }

  if (options.overrides) {
    // Trailing block so project overrides win over shared/vue/ts packs.
    configs.push((async () => {
      const plugins = enableTs
        ? { '@typescript-eslint': await loadTypescriptPlugin() }
        : undefined;

      return [
        {
          name: 'qstanay/overrides',
          files,
          ...(plugins ? { plugins } : {}),
          rules: options.overrides,
        },
      ];
    })());
  }

  const composer = new FlatConfigComposer<TypedFlatConfigItem>();
  composer.append(...configs, ...userConfigs as any);
  return composer;
}
