import type { Linter } from 'eslint';

export function javascriptRules(): Linter.RulesRecord {
  return {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'eqeqeq': ['error', 'always'],
    'object-shorthand': ['error', 'always'],
    'prefer-template': 'error',
    'curly': ['error', 'all'],
    'arrow-body-style': ['error', 'as-needed'],
  };
}

export function typescriptRules(): Linter.RulesRecord {
  return {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: false },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-magic-numbers': [
      'warn',
      {
        ignore: [-1, 0, 1, 2, 1000],
        ignoreEnums: true,
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreClassFieldInitialValues: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
  };
}

/**
 * Shared opinionated rules.
 * TypeScript rules are included only when `typescript` is true,
 * so JS-only projects do not reference a missing plugin.
 */
export function sharedRules(options: { typescript?: boolean } = {}): Linter.RulesRecord {
  return {
    ...javascriptRules(),
    ...(options.typescript ? typescriptRules() : {}),
  };
}
