const defaultConfig = {
  presets: [
    ['@babel/preset-env'],
  ],
}

const testConfig = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
}

module.exports = api => {
  return api.env('test') ? testConfig : defaultConfig
}
