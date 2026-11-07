# Changelog

All notable changes to this project are documented in this file.

## [1.2.0] - 2026-11-08

### Added

- Document how to set a 4-space indent in a consuming project via `stylistic.indent` for both `defineConfig()` and `nuxt()`. The preset default stays 2 spaces, and `vue/html-indent` follows the same value.

## [1.1.1] - 2026-08-16

### Fixed

- `/nuxt` no longer registers its own `@typescript-eslint` plugin. It only adds rules on top of the plugin from `@nuxt/eslint`, so consumers do not need pnpm/npm `overrides` to avoid “two instances of plugin `@typescript-eslint`”.

## [1.1.0] - 2026-08-08

### Added

- Vitest support via `test` option for `defineConfig()` and `nuxt()`
  - Auto-enabled when `vitest` is installed (`test: false` to disable)
  - Applies `@vitest/eslint-plugin` recommended rules to common test globs
  - Declares Vitest globals (`describe`, `it`, `expect`, `vi`, …) for those files

## [1.0.4] - 2026-07-27

### Fixed

- Add browser globals when Vue is enabled so `document` / `window` in app entry files do not trip `no-undef` (especially with `typescript: false`)
- Never use `@typescript-eslint/parser` as the root parser for `.vue`; keep `vue-eslint-parser` as root and apply TS recommended rules via a separate Vue rules block
- Scope TypeScript shared rules to TS/Vue files only (do not apply `@typescript-eslint/*` to plain JS/MJS)
- Register `@typescript-eslint` on config objects that reference TS rules so flat config stays valid
- Sync `vue/html-indent` with `stylistic.indent` in both `defineConfig()` and `nuxt()`

### Changed

- `TypedFlatConfigItem` now aliases `Linter.Config` instead of deprecated `Linter.FlatConfig`

## [1.0.3] - 2026-07-20

### Fixed

- Do not attach the TypeScript parser to `.vue` when Vue is disabled (avoids fatal parse errors)
- Ignore `.vue` files when Vue is disabled so `eslint .` does not crash on stray SFCs
- Apply shared rules and overrides to `.mjs` / `.cjs` (not only `.js`)
- Declare Node + ES2022 globals in the JavaScript layer so `no-undef` no longer false-positives on `console` / `process`
- Resolve TypeScript types for `@qstanay/eslint-config/nuxt` via package `exports`
- Declare `typescript` as an optional peer dependency (matches existing `peerDependenciesMeta`)
- Use an explicit options array for `vue/padding-line-between-tags`

### Changed

- Fill `author` and `engines.node` (`>=18`) in `package.json`

## [1.0.2] - 2026-07-18

### Added

- `@eslint/js` recommended as the JavaScript baseline in `defineConfig()`
- Autofixable `import/order` (grouped + alphabetized)
- `strict` option for `defineConfig()` / `nuxt()` to opt into stricter TypeScript rules (e.g. `no-magic-numbers`)
- `ignores` option on the Nuxt preset (`nuxt({ ignores: [...] })`)
- npm `keywords` for discoverability

### Changed

- `no-magic-numbers` is no longer enabled by default (use `strict: true`)
- When TypeScript is enabled, turn off conflicting base rules (`no-unused-vars`, `no-undef`)

## [1.0.1] - 2026-07-18

### Fixed

- Correctly apply the full `eslint-plugin-vue` `flat/recommended` preset (previously only `[0].rules` was used, which contained no rules)
- Include TypeScript shared rules only when TypeScript is enabled (JS-only projects no longer crash on a missing `@typescript-eslint` plugin)
- Apply `overrides` in a trailing config block so they win over shared/Vue rules in both `defineConfig()` and `nuxt()`

### Added

- Honor project `.gitignore` in ignores and add `coverage` to default ignores
- Browser `globals` for Vue; load TypeScript rules from `flat/recommended`
- `prepublishOnly` build hook
- Expanded README for humans and agents
- Tests for JS-only setups, Vue recommended rules, and overrides behavior

### Removed

- Unused dependency `eslint-processor-vue-blocks`

## [1.0.0] - 2026-07-13

### Added

- Initial release of `@qstanay/eslint-config`
- `defineConfig()` for Vue and TypeScript projects
- `@qstanay/eslint-config/nuxt` layer for use with `@nuxt/eslint` + `withNuxt()`
- Stylistic formatting via `@stylistic` (`eslint --fix`)
- Shared opinionated JS/TS rules, import hygiene, and Vue opinionated extras
