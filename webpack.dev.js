const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-cheap-source-map',
  output: {
    filename: 'insticator-session.js',
  },
})
