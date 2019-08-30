const defaultConfig = {
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { useESModules: true }],
  ],
}

const testConfig = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: 'current',
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
}

module.exports = api => {
  return api.env('test') ? testConfig : defaultConfig
}
