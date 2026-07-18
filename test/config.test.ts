import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';
import { nuxt as nuxtPreset } from '../src/nuxt';

function findByName(configs: any[], name: string) {
  return configs.find(c => c && typeof c === 'object' && c.name === name);
}

describe('defineConfig()', () => {
  it('materializes to a flat config array', async () => {
    const configs = await defineConfig({ stylistic: false, vue: false, nuxt: false });
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBeGreaterThan(0);
  });

  it('does not include vue plugin when vue: false', async () => {
    const configs = await defineConfig({ stylistic: false, vue: false, nuxt: false });
    const vue = findByName(configs, 'qstanay/vue');
    expect(vue).toBeUndefined();
  });

  it('includes vue config when vue: true', async () => {
    const configs = await defineConfig({ stylistic: false, vue: true, nuxt: false });
    const vue = findByName(configs, 'qstanay/vue');
    expect(vue).toBeTruthy();
    expect(vue.plugins?.vue).toBeTruthy();
  });

  it('includes stylistic config by default', async () => {
    const configs = await defineConfig({ vue: false, nuxt: false });
    const style = findByName(configs, 'qstanay/stylistic');
    expect(style).toBeTruthy();
    expect(style.plugins?.style).toBeTruthy();
  });

  it('can disable stylistic', async () => {
    const configs = await defineConfig({ stylistic: false, vue: false, nuxt: false });
    const style = findByName(configs, 'qstanay/stylistic');
    expect(style).toBeUndefined();
  });

  it('includes nuxt config when nuxt: true', async () => {
    const configs = await defineConfig({ stylistic: false, vue: false, nuxt: true });
    const nuxt = findByName(configs, 'qstanay/nuxt');
    expect(nuxt).toBeTruthy();
    expect(nuxt.plugins?.nuxt).toBeTruthy();
  });
});

describe('nuxt() preset', () => {
  it('returns a list of async config blocks', async () => {
    const blocks = nuxtPreset();
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);

    const resolved = (await Promise.all(blocks)).flat();
    expect(findByName(resolved, 'qstanay/nuxt')).toBeTruthy();
    expect(findByName(resolved, 'qstanay/vue')).toBeTruthy();
  });
});
