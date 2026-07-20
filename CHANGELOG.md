# Changelog

All notable changes to this project are documented in this file.

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
