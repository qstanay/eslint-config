import type { StylisticOptions } from './types';

import { isPackageExists } from 'local-pkg';

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

export const SOURCE_FILES = ['**/*.{js,jsx,ts,tsx,cts,mts,vue}'] as const;
export const TYPESCRIPT_FILES = ['**/*.{ts,tsx,cts,mts}', '**/*.vue'] as const;
export const VUE_FILES = ['**/*.vue'] as const;
