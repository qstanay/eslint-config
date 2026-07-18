import type { TypedFlatConfigItem, StylisticOptions } from '../types';

async function loadStylistic() {
  const mod = await import('@stylistic/eslint-plugin');
  return mod.default ?? mod;
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    indent = 2,
    quotes = 'single',
    semi = true,
    maxLen = 100,
  } = options;

  const plugin = await loadStylistic();

  // `customize()` gives us a coherent bundle of stylistic rules.
  // Plugin name is fixed to `style` for stable rule IDs.
  const config = plugin.configs.customize({
    indent,
    quotes,
    semi,
    jsx: false,
    pluginName: 'style',
  }) as TypedFlatConfigItem;

  return [
    {
      name: 'qstanay/stylistic',
      plugins: {
        style: plugin,
      },
      rules: {
        ...(config.rules ?? {}),
        // Keep max line length aligned across all projects.
        'style/max-len': [
          'warn',
          {
            code: maxLen,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreComments: true,
            ignoreTrailingComments: true,
            ignoreRegExpLiterals: true,
          },
        ],
      },
    },
  ];
}
