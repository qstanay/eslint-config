import type { Linter } from 'eslint';

export type Awaitable<T> = T | Promise<T>;

export type TypedFlatConfigItem = Linter.FlatConfig;

export interface StylisticOptions {
  indent?: 2 | 4;
  quotes?: 'single' | 'double';
  semi?: boolean;
  maxLen?: number;
}

export interface OptionsConfig {
  /**
   * Enable Vue rules when the project depends on Vue/Nuxt unless explicitly set.
   */
  vue?: boolean;
  /**
   * Enable Nuxt-specific rules when `nuxt` is installed unless explicitly set.
   */
  nuxt?: boolean;
  /**
   * Enable TypeScript rules when `typescript` is installed unless explicitly set.
   */
  typescript?: boolean;
  stylistic?: boolean | StylisticOptions;
  /**
   * Extra ignores appended to defaults.
   */
  ignores?: string[];
  /**
   * Pass-through overrides merged last.
   */
  overrides?: Linter.RulesRecord;
}
