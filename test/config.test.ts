import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';
import { nuxt as nuxtPreset } from '../src/nuxt';

function findByName(configs: any[], name: string) {
  return configs.find(c => c && typeof c === 'object' && c.name === name);
}

function findAllByNamePrefix(configs: any[], prefix: string) {
  return configs.filter(c => (
    c
    && typeof c === 'object'
    && typeof c.name === 'string'
    && c.name.startsWith(prefix)
  ));
}

describe('defineConfig()', () => {
  it('materializes to a flat config array', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBeGreaterThan(0);
  });

  it('includes node/es2022 globals on the javascript layer', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const javascript = findByName(configs, 'qstanay/javascript');
    expect(javascript.languageOptions?.globals?.console).toBeDefined();
    expect(javascript.languageOptions?.globals?.process).toBeDefined();
  });

  it('scopes shared rules to mjs/cjs as well as js', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const shared = findByName(configs, 'qstanay/shared-rules');
    expect(shared.files).toEqual(['**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}']);
  });

  it('includes .vue in shared rules when vue is enabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });
    const shared = findByName(configs, 'qstanay/shared-rules');
    expect(shared.files).toEqual(['**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}', '**/*.vue']);
  });

  it('ignores .vue files when vue is disabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
    });
    const ignoreBlock = findByName(configs, 'qstanay/ignores');
    expect(ignoreBlock.ignores).toContain('**/*.vue');
  });

  it('does not attach typescript parser to .vue when vue is disabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
    });
    const typescript = findByName(configs, 'qstanay/typescript');
    expect(typescript.files).toEqual(['**/*.{ts,tsx,cts,mts}']);
    expect(typescript.languageOptions?.parser).toBeTruthy();
    expect(findByName(configs, 'qstanay/typescript/vue-rules')).toBeUndefined();
  });

  it('keeps typescript root parser off .vue when vue is enabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });
    const typescript = findByName(configs, 'qstanay/typescript');
    expect(typescript.files).toEqual(['**/*.{ts,tsx,cts,mts}']);
    expect(typescript.files).not.toContain('**/*.vue');

    const vueTsRules = findByName(configs, 'qstanay/typescript/vue-rules');
    expect(vueTsRules).toBeTruthy();
    expect(vueTsRules.files).toEqual(['**/*.vue']);
    expect(vueTsRules.languageOptions?.parser).toBeUndefined();
    expect(vueTsRules.plugins?.['@typescript-eslint']).toBeTruthy();
  });

  it('adds browser globals when vue is enabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: false,
    });
    const javascript = findByName(configs, 'qstanay/javascript');
    expect(javascript.languageOptions?.globals?.document).toBeDefined();
    expect(javascript.languageOptions?.globals?.window).toBeDefined();
  });

  it('does not add browser globals when vue is disabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const javascript = findByName(configs, 'qstanay/javascript');
    expect(javascript.languageOptions?.globals?.document).toBeUndefined();
  });

  it('syncs vue/html-indent with stylistic indent', async () => {
    const configs = await defineConfig({
      vue: true,
      nuxt: false,
      typescript: true,
      stylistic: { indent: 4 },
    });
    const vue = findByName(configs, 'qstanay/vue/rules');
    expect(vue.rules['vue/html-indent']).toEqual(['error', 4]);
  });

  it('does not force vue/html-indent when stylistic is disabled', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });
    const vue = findByName(configs, 'qstanay/vue/rules');
    expect(vue.rules['vue/html-indent']).toBeUndefined();
  });

  it('includes vitest config when test: true', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
      test: true,
    });
    const test = findByName(configs, 'qstanay/test');
    expect(test).toBeTruthy();
    expect(test.plugins?.vitest).toBeTruthy();
    expect(test.languageOptions?.globals?.describe).toBeDefined();
    expect(test.rules?.['vitest/no-focused-tests']).toBeTruthy();
  });

  it('can disable vitest config with test: false', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
      test: false,
    });
    expect(findByName(configs, 'qstanay/test')).toBeUndefined();
  });

  it('uses an explicit options array for vue/padding-line-between-tags', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });
    const vue = findByName(configs, 'qstanay/vue/rules');
    expect(Array.isArray(vue.rules['vue/padding-line-between-tags'])).toBe(true);
  });

  it('includes @eslint/js recommended and import/order', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const javascript = findByName(configs, 'qstanay/javascript');
    expect(javascript).toBeTruthy();
    expect(javascript.rules?.['no-with']).toBe('error');

    const imports = findByName(configs, 'qstanay/imports');
    expect(imports.rules?.['import/order']).toBeTruthy();
  });

  it('keeps no-magic-numbers off unless strict is enabled', async () => {
    const defaultConfigs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
    });
    const sharedTs = findByName(defaultConfigs, 'qstanay/shared-rules/typescript');
    expect(sharedTs.rules['@typescript-eslint/no-magic-numbers']).toBeUndefined();

    const strictConfigs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
      strict: true,
    });
    const strictShared = findByName(strictConfigs, 'qstanay/shared-rules/typescript');
    expect(strictShared.rules['@typescript-eslint/no-magic-numbers']).toBeTruthy();
  });

  it('does not include vue plugin when vue: false', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const vue = findByName(configs, 'qstanay/vue/rules');
    expect(vue).toBeUndefined();
    expect(findAllByNamePrefix(configs, 'vue/').length).toBe(0);
  });

  it('includes official vue recommended blocks when vue: true', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });
    const opinionated = findByName(configs, 'qstanay/vue/rules');
    expect(opinionated).toBeTruthy();
    expect(opinionated.rules?.['vue/html-self-closing']).toBeTruthy();

    // Official flat/recommended is an array; first block is setup with plugins.
    const vueSetup = findByName(configs, 'vue/base/setup');
    expect(vueSetup).toBeTruthy();
    expect(vueSetup.plugins?.vue).toBeTruthy();

    const vueRecommendedRules = findByName(configs, 'vue/recommended/rules');
    expect(vueRecommendedRules).toBeTruthy();
    expect(Object.keys(vueRecommendedRules.rules ?? {}).length).toBeGreaterThan(0);
  });

  it('includes stylistic config by default', async () => {
    const configs = await defineConfig({
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const style = findByName(configs, 'qstanay/stylistic');
    expect(style).toBeTruthy();
    expect(style.plugins?.style).toBeTruthy();
  });

  it('can disable stylistic', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const style = findByName(configs, 'qstanay/stylistic');
    expect(style).toBeUndefined();
  });

  it('includes nuxt config when nuxt: true', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: true,
      typescript: true,
    });
    const nuxt = findByName(configs, 'qstanay/nuxt');
    expect(nuxt).toBeTruthy();
    expect(nuxt.plugins?.nuxt).toBeTruthy();
  });

  it('keeps typescript rules out of shared when typescript: false', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });
    const shared = findByName(configs, 'qstanay/shared-rules');
    expect(findByName(configs, 'qstanay/shared-rules/typescript')).toBeUndefined();
    expect(shared.rules['@typescript-eslint/no-unused-vars']).toBeUndefined();
    expect(shared.rules['no-console']).toBeTruthy();
  });

  it('puts overrides after shared and vue rules', async () => {
    const configs = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
      overrides: {
        'vue/html-self-closing': 'off',
      },
    });

    const overrides = findByName(configs, 'qstanay/overrides');
    expect(overrides).toBeTruthy();
    expect(overrides.rules['vue/html-self-closing']).toBe('off');

    const sharedIndex = configs.findIndex((c: any) => c?.name === 'qstanay/shared-rules');
    const vueRulesIndex = configs.findIndex((c: any) => c?.name === 'qstanay/vue/rules');
    const overridesIndex = configs.findIndex((c: any) => c?.name === 'qstanay/overrides');
    expect(overridesIndex).toBeGreaterThan(sharedIndex);
    expect(overridesIndex).toBeGreaterThan(vueRulesIndex);
  });
});

describe('nuxt() preset', () => {
  it('returns shared rules without re-registering vue/typescript plugins', async () => {
    const blocks = nuxtPreset({ stylistic: false });
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);

    const resolved = (await Promise.all(blocks)).flat();
    expect(findByName(resolved, 'qstanay/nuxt/shared-rules')).toBeTruthy();
    expect(findByName(resolved, 'qstanay/nuxt/shared-rules/typescript')).toBeTruthy();
    expect(findByName(resolved, 'qstanay/vue/rules')).toBeUndefined();
    expect(findByName(resolved, 'qstanay/typescript')).toBeUndefined();
  });

  it('includes stylistic when enabled', async () => {
    const resolved = (await Promise.all(nuxtPreset())).flat();
    expect(findByName(resolved, 'qstanay/stylistic')).toBeTruthy();
  });

  it('applies overrides after vue rules', async () => {
    const resolved = (await Promise.all(nuxtPreset({
      stylistic: false,
      overrides: {
        'vue/html-self-closing': 'off',
      },
    }))).flat();

    const vueIndex = resolved.findIndex((c: any) => c?.name === 'qstanay/nuxt/vue-rules');
    const overridesIndex = resolved.findIndex((c: any) => c?.name === 'qstanay/nuxt/overrides');
    expect(overridesIndex).toBeGreaterThan(vueIndex);
    expect(findByName(resolved, 'qstanay/nuxt/overrides').rules['vue/html-self-closing']).toBe('off');
  });

  it('supports extra ignores', async () => {
    const resolved = (await Promise.all(nuxtPreset({
      stylistic: false,
      ignores: ['**/tmp/**'],
    }))).flat();

    const ignoreBlock = findByName(resolved, 'qstanay/ignores');
    expect(ignoreBlock).toBeTruthy();
    expect(ignoreBlock.ignores).toContain('**/tmp/**');
  });

  it('syncs vue/html-indent with stylistic indent', async () => {
    const resolved = (await Promise.all(nuxtPreset({
      stylistic: { indent: 4 },
      test: false,
    }))).flat();

    const vue = findByName(resolved, 'qstanay/nuxt/vue-rules');
    expect(vue.rules['vue/html-indent']).toEqual(['error', 4]);
  });

  it('includes vitest config when test: true', async () => {
    const resolved = (await Promise.all(nuxtPreset({
      stylistic: false,
      test: true,
    }))).flat();

    const test = findByName(resolved, 'qstanay/test');
    expect(test).toBeTruthy();
    expect(test.plugins?.vitest).toBeTruthy();
  });
});
