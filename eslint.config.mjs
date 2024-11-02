import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'node_modules',
    '**/node_modules/**',
    'dist',
    '**/dist/**',
    'out',
    '**/out/**',
    '.gitignore',
    '**/.gitignore/**',
  ],
  react: true,
  typescript: {
    overrides: {
      'node/prefer-global/process': 'off',
      'no-console': 'off',
      'ts/ban-ts-comment': 'off',
    },
  },
})
