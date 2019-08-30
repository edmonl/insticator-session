const merge = require('webpack-merge')
const Terser = require('terser-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'insticator-session.min.js',
  },
  optimization: {
    minimizer: [
      new Terser({
        terserOptions: {
          parse: {
            html5_comments: false,
            shebang: false,
          },
        },
      }),
    ],
  },
})
