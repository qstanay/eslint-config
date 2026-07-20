import { isPackageExists } from 'local-pkg';

import type { StylisticOptions } from './types';

export function resolveEnabled(explicit: boolean | undefined, detected: boolean) {
  return explicit ?? detected;
}

export function has(pkg: string) {
  return isPackageExists(pkg);
}

export function resolveStylisticOptions(
  stylistic: boolean | StylisticOptions | undefined,
): false | StylisticOptions {
  if (stylistic === false) {
    return false;
  }

  if (typeof stylistic === 'object') {
    return stylistic;
  }

  return {};
}

const SCRIPT_FILES = [
  '**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts}',
] as const;

export const VUE_FILES = ['**/*.vue'] as const;

/** TypeScript sources (`.vue` is added only when Vue is enabled). */
export const TYPESCRIPT_FILES = [
  '**/*.{ts,tsx,cts,mts}',
] as const;

/**
 * Files that receive shared / override rule packs.
 * `.vue` is included only when Vue support is enabled.
 */
export function sourceFiles(vueEnabled: boolean): string[] {
  return vueEnabled
    ? [...SCRIPT_FILES, ...VUE_FILES]
    : [...SCRIPT_FILES];
}

export function typescriptFiles(vueEnabled: boolean): string[] {
  return vueEnabled
    ? [...TYPESCRIPT_FILES, ...VUE_FILES]
    : [...TYPESCRIPT_FILES];
}

/** Files that receive shared / override rule packs when Vue is enabled. */
export const SOURCE_FILES = [
  '**/*.{js,mjs,cjs,jsx,ts,tsx,cts,mts,vue}',
] as const;
