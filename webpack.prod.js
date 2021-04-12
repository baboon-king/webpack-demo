const common = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require('webpack-merge');

/**
 * @type {import('webpack/types').Configuration}
 */
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'public' },
      ]
    })
  ]
})