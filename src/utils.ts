import { isPackageExists } from 'local-pkg';

export function resolveEnabled(explicit: boolean | undefined, detected: boolean) {
  return explicit ?? detected;
}

export function has(pkg: string) {
  return isPackageExists(pkg);
}
