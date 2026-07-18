# @qstanay/eslint-config

Opinionated ESLint **flat config** for:

- Nuxt applications
- Vue applications
- TypeScript packages

This preset uses **@stylistic** for formatting through ESLint (single toolchain: `eslint --fix`).

## Requirements

- Node.js 18+ recommended
- ESLint `^9 || ^10`

## Install

```bash
npm i -D eslint @qstanay/eslint-config
```

## Usage

### Nuxt (recommended)

In a Nuxt app, use `@nuxt/eslint` module and layer this preset on top of Nuxt generated config.

1) Ensure Nuxt ESLint module is enabled in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
})
```

2) Create `eslint.config.mjs`:

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

### Vue (Vite) app

Create `eslint.config.mjs`:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig({
  vue: true,
  typescript: true,
})
```

### TypeScript package

Create `eslint.config.mjs`:

```js
import { defineConfig } from '@qstanay/eslint-config'

export default defineConfig({
  vue: false,
  nuxt: false,
  typescript: true,
})
```

## Options

### `stylistic`

Enable/disable formatting rules (enabled by default).

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

Set `stylistic: false` to disable all stylistic rules.

### `overrides`

Merge custom rules last.

```js
defineConfig({
  overrides: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
})
```

### `ignores`

Add extra ignore globs.

```js
defineConfig({
  ignores: ['**/coverage/**'],
})
```

## Scripts

Suggested `package.json` scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## VS Code setup

Use ESLint as the formatter and apply fixes on save.

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Notes

- For Nuxt projects, this package intentionally does **not** replace `@nuxt/eslint` project-aware config. It extends it.
- This package focuses on Nuxt/Vue/TypeScript. JSON/YAML/Markdown/CSS formatting can be added later if needed.

