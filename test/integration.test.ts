import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { concat } from 'eslint-flat-config-utils';
import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';
import { nuxt as nuxtPreset } from '../src/nuxt';
import { lintFiles, ruleIds } from './utils';

const fixturesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

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
      path.join(fixturesRoot, 'vue-vite/valid.vue'),
    ]);

    expect(results[0]?.errorCount).toBe(0);
  });

  it('reports vue and javascript violations in invalid SFC', async () => {
    const config = await defineConfig({
      stylistic: false,
      vue: true,
      nuxt: false,
      typescript: true,
    });

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'vue-vite/invalid.vue'),
    ]);

    const rules = ruleIds(results);
    expect(rules).toContain('no-console');
    expect(rules).toContain('vue/html-self-closing');
    expect(results[0]?.errorCount).toBeGreaterThan(0);
  });
});

describe('integration: nuxt preset', () => {
  it('lints vue fixture with resolved nuxt preset blocks', async () => {
    const config = await concat(
      ...(await Promise.all(nuxtPreset({ stylistic: false }))),
    );

    const results = await lintFiles(config, [
      path.join(fixturesRoot, 'nuxt-preset/valid.vue'),
    ]);

    expect(results[0]?.fatalErrorCount ?? 0).toBe(0);
    expect(results[0]?.errorCount).toBe(0);
  });
});
