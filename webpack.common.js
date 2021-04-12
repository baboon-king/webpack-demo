const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @type {import ('webpack/types').Configuration}
 */
module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[name].js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5 * 1024
          }
        }
      },
      {
        test: /.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'srcset',
                },
                {
                  tag: 'a',
                  attribute: 'href',
                  type: 'srcset',
                },
              ]
            }
          }
        },
        exclude: /index.html/ //排除 html-webpack-plugin 使用的模板文件，解决变量不输出问题
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'hello HtmlWebpackPlugin!',
      meta: {
        viewport: 'width=device-width'
      },
      template: './index.html',
      inject: true
    }),
  ]
}