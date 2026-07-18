import { ESLint } from 'eslint';
import type { Linter } from 'eslint';

export async function lintFiles(
  config: Linter.Config[],
  filePaths: string[],
) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
  });

  return eslint.lintFiles(filePaths);
}

export function ruleIds(results: Awaited<ReturnType<typeof lintFiles>>) {
  return results.flatMap(result => result.messages.map(message => message.ruleId));
}
