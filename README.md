# @qstanay/eslint-config

Opinionated ESLint **flat config** for Nuxt apps, Vue apps, and TypeScript packages.

Formatting is handled by ESLint via **@stylistic** (`eslint --fix`). Do **not** use Prettier alongside this preset unless you disable stylistic rules.

## Quick pick

| Project type | Use this |
|---|---|
| **Nuxt** | `@qstanay/eslint-config/nuxt` with `@nuxt/eslint` + `withNuxt()` |
| **Vue (Vite / SPA)** | `defineConfig()` from `@qstanay/eslint-config` |
| **TypeScript package / library** | `defineConfig()` from `@qstanay/eslint-config` |

For Nuxt, prefer the `/nuxt` entry. It only adds opinionated rules + formatting on top of Nuxt's own TypeScript/Vue setup. It does **not** replace `@nuxt/eslint`.

## Requirements

- Node.js 18+
- ESLint `^9 || ^10`
- Flat config only (`eslint.config.js` / `.mjs` / `.ts`)

## Install

```bash
npm i -D eslint @qstanay/eslint-config
```

For Nuxt also install and enable the Nuxt ESLint module:

```bash
npm i -D @nuxt/eslint
```

## Usage

### Nuxt (recommended)

1. Enable the module in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
})
```

2. Create `eslint.config.mjs` in the project root:

```js
import withNuxt from './.nuxt/eslint.config.mjs'
import { nuxt } from '@qstanay/eslint-config/nuxt'

export default withNuxt(
  ...nuxt({
    stylistic: {
      semi: true,
      quotes: 'single',
      indent: 2,
      maxLen: 100,
    },
  }),
)
```

Run `nuxt prepare` (or start the dev server once) so `.nuxt/eslint.config.mjs` exists before linting.

Minimal form (defaults are fine for most projects):

```js
import withNuxt from './.nuxt/eslint.config.mjs'
import { nuxt } from '@qstanay/eslint-config/nuxt'

export default withNuxt(...nuxt())
```

### Vue (Vite) app

Create `eslint.config.mjs`:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig({
  vue: true,
  typescript: true,
})
```

If `vue` and `typescript` are already installed, auto-detection is enough:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig()
```

### TypeScript package

Create `eslint.config.mjs`:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig({
  typescript: true,
})
```

Or rely on auto-detection when `typescript` is a dependency:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig()
```

## Options

### `defineConfig(options, ...userConfigs)`

Main entry for Vue / TypeScript projects.

| Option | Type | Default | Description |
|---|---|---|---|
| `vue` | `boolean` | auto (`vue` or `nuxt` installed) | Enable Vue rules |
| `typescript` | `boolean` | auto (`typescript` installed) | Enable TypeScript rules |
| `nuxt` | `boolean` | auto (`nuxt` installed) | Enable Nuxt plugin rule(s). Prefer `/nuxt` for Nuxt apps |
| `stylistic` | `false \| object` | enabled | Formatting rules (see below) |
| `overrides` | `Linter.RulesRecord` | `{}` | Custom rules merged last over shared rules |
| `ignores` | `string[]` | `[]` | Extra ignore globs |

Extra flat-config blocks can be passed as additional arguments:

```js
export default defineConfig(
  { typescript: true },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
```

### `nuxt(options)` — `@qstanay/eslint-config/nuxt`

Layer for Nuxt apps used with `withNuxt(...nuxt())`.

| Option | Type | Default | Description |
|---|---|---|---|
| `stylistic` | `false \| object` | enabled | Formatting rules (see below) |
| `overrides` | `Linter.RulesRecord` | `{}` | Custom rules merged last over shared rules |

There are no `vue` / `typescript` flags here — `@nuxt/eslint` already provides that stack. This preset adds shared opinionated rules, Vue opinionated rules, and stylistic formatting.

### `stylistic`

Enabled by default. Defaults:

| Key | Default |
|---|---|
| `indent` | `2` |
| `quotes` | `'single'` |
| `semi` | `true` |
| `maxLen` | `100` |

```js
defineConfig({
  stylistic: {
    semi: true,
    quotes: 'single',
    indent: 2,
    maxLen: 100,
  },
})
```

Disable formatting rules entirely:

```js
defineConfig({ stylistic: false })
// or for Nuxt:
nuxt({ stylistic: false })
```

### `overrides`

```js
defineConfig({
  overrides: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
  },
})
```

Same option works in `nuxt({ overrides: { ... } })`.

### `ignores`

Built-in ignores cover `node_modules`, `dist`, `.output`, `.nuxt`, `.nitro`, `coverage`, and the project `.gitignore` (when present).

```js
defineConfig({
  ignores: ['**/fixtures/**'],
})
```

`ignores` is only on `defineConfig`, not on the Nuxt preset (use Nuxt / ESLint ignore mechanisms there if needed).

## Prettier

**Do not use Prettier with this preset while `stylistic` is enabled.** Both tools format the same things (quotes, semicolons, indentation, line length) and will conflict.

Recommended setup:

- Keep `@stylistic` enabled
- Format with `eslint . --fix`
- Use ESLint as the editor formatter

If you must keep Prettier:

```js
defineConfig({ stylistic: false })
// Nuxt:
nuxt({ stylistic: false })
```

Then let Prettier own formatting and keep ESLint for logic/quality rules only.

## Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## VS Code / Cursor

Use ESLint as the formatter and fix on save.

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.useFlatConfig": true
}
```

Disable Prettier for the same file types (or uninstall / disable the Prettier extension in the project) to avoid fights on save.

## What this preset enforces (high level)

- Shared JS rules always; TypeScript opinionated rules only when TypeScript is enabled (so JS-only projects stay valid)
- Official `eslint-plugin-vue` `flat/recommended` when Vue is enabled, plus a small opinionated Vue layer (self-closing tags, attribute order, padding between tags)
- Stylistic formatting via `@stylistic` (rule namespace: `style/*`)
- Import hygiene via `eslint-plugin-import-x` in `defineConfig` (Nuxt relies on `@nuxt/eslint` for its own import/TS/Vue stack)
- `overrides` are applied in a trailing config block so they win over shared/Vue rules

## Agent / setup checklist

When adding this package to a project:

1. Install `eslint` + `@qstanay/eslint-config` as devDependencies.
2. Choose the correct entry:
   - Nuxt → `@qstanay/eslint-config/nuxt` + `@nuxt/eslint` + `withNuxt(...nuxt())`
   - Vue / TS → `defineConfig(...)`
3. Create root `eslint.config.mjs` (or `.ts` if the project already supports it).
4. Add `lint` / `lint:fix` scripts.
5. Do **not** add Prettier for JS/TS/Vue unless `stylistic: false`.
6. For Nuxt, ensure `@nuxt/eslint` is in `modules` and `.nuxt/eslint.config.mjs` exists (`nuxt prepare`).
7. Prefer `overrides` for project-specific exceptions instead of forking the preset.

## Notes

- Flat config only. Legacy `.eslintrc*` is not supported.
- Scope is Nuxt / Vue / TypeScript JS-like sources. JSON, YAML, Markdown, and CSS formatting are out of scope for now.
- License: MIT
