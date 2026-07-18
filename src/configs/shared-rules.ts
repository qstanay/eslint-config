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

export function typescriptRules(options: { strict?: boolean } = {}): Linter.RulesRecord {
  const rules: Linter.RulesRecord = {
    // Disable base rules that conflict with TypeScript-aware variants.
    'no-unused-vars': 'off',
    'no-undef': 'off',

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
  };

  if (options.strict) {
    rules['@typescript-eslint/no-magic-numbers'] = [
      'warn',
      {
        ignore: [-1, 0, 1, 2, 1000],
        ignoreEnums: true,
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreClassFieldInitialValues: true,
        ignoreReadonlyClassProperties: true,
      },
    ];
  }

  return rules;
}

/**
 * Shared opinionated rules.
 * TypeScript rules are included only when `typescript` is true,
 * so JS-only projects do not reference a missing plugin.
 */
export function sharedRules(options: {
  typescript?: boolean;
  strict?: boolean;
} = {}): Linter.RulesRecord {
  return {
    ...javascriptRules(),
    ...(options.typescript
      ? typescriptRules({ strict: options.strict })
      : {}),
  };
}
