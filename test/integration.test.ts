import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { concat } from 'eslint-flat-config-utils';
import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';
import { typescript as typescriptConfig } from '../src/configs/typescript';
import { nuxt as nuxtPreset } from '../src/nuxt';
import { lintFiles, ruleIds } from './utils';

const fixturesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

describe('integration: javascript package', () => {
  it('lints valid fixture without typescript plugin', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'js-package/valid.js'),
    ]);

    expect(results[0]?.errorCount).toBe(0);
  });

  it('reports javascript violations without requiring typescript plugin', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: false,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'js-package/invalid.js'),
    ]);

    const rules = ruleIds(results);
    expect(rules).toContain('no-console');
    expect(rules).toContain('no-debugger');
    expect(results[0]?.errorCount).toBeGreaterThan(1);
  });
});

describe('integration: typescript package', () => {
  it('lints valid fixture without errors', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'ts-package/valid.ts'),
    ]);

    expect(results[0]?.errorCount).toBe(0);
  });

  it('reports expected rule violations in invalid fixture', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: false,
      nuxt: false,
      typescript: true,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'ts-package/invalid.ts'),
    ]);

    const rules = ruleIds(results);
    expect(rules).toContain('no-console');
    expect(rules).toContain('no-debugger');
    expect(results[0]?.errorCount).toBeGreaterThan(1);
  });
});

describe('integration: vue app', () => {
  it('lints valid SFC without errors', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'vue-vite/ValidApp.vue'),
    ]);

    expect(results[0]?.errorCount).toBe(0);
  });

  it('reports vue recommended and opinionated violations in invalid SFC', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'vue-vite/InvalidApp.vue'),
    ]);

    const rules = ruleIds(results);
    expect(rules).toContain('no-console');
    expect(rules).toContain('vue/html-self-closing');
    // From official flat/recommended (was previously dropped by [0].rules).
    expect(rules).toContain('vue/no-use-v-if-with-v-for');
    expect(results[0]?.errorCount).toBeGreaterThan(0);
  });

  it('lets overrides disable vue opinionated rules', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
      overrides: {
        'vue/html-self-closing': 'off',
      },
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'vue-vite/InvalidApp.vue'),
    ]);

    const rules = ruleIds(results);
    expect(rules).not.toContain('vue/html-self-closing');
    expect(rules).toContain('no-console');
  });
});

describe('integration: nuxt preset', () => {
  it('applies shared rules when typescript plugin is already provided', async () => {
    // Mimics @nuxt/eslint: host provides plugins, our preset only adds rules.
    const config = await concat(
      ...(await typescriptConfig()),
      ...(await Promise.all(nuxtPreset({ stylistic: false }))),
    );

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'ts-package/invalid.ts'),
    ]);

    const rules = ruleIds(results);
    expect(rules).toContain('no-console');
    expect(rules).toContain('no-debugger');
    expect(results[0]?.errorCount).toBeGreaterThan(0);
  });
});
