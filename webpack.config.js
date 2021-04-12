const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const logger = console.log


const allSourceMapModes = [
  'eval',
  'cheap-eval-source-map',
  'cheap-module-eval-source-map',
  'eval-source-map',
  'cheap-source-map',
  'cheap-module-source-map',
  'inline-cheap-source-map',
  'inline-cheap-module-source-map',
  'source-map',
  'inline-source-map',
  'hidden-source-map',
  'nosources-source-map'
]


class MyPlugin {
  /**
   * @param {import ('./node_modules/webpack/types').Compiler} compiler
   */
  apply (compiler) {
    logger('MyPlugin 启动');
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation 本次打包上下文
      for (const name in compilation.assets) {
        const assets = compilation.assets
        // fileName
        // logger(name);
        // fileContent
        // logger(assets[name].source());
        if (name.endsWith('.js')) {
          const content = assets[name].source()
          const withoutComments = content.replace(/\/\*\*+\//g, '') + ''
          assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}

module.exports = (env, args) => {
  logger('env', env)
  logger('args', args)
  /**
   * @type {import('webpack/types').Configuration} config
   */
  const config = {
    mode: 'none',
    entry: './src/main.js',
    devtool: 'eval-cheap-module-source-map',
    output: {
      filename: '[name]-[contenthash:8].bundle.js',
      path: path.join(__dirname, 'dist'),
      chunkFilename: '[name]-[contenthash:8].bundle.js',
    },
    target: 'web',
    devServer: {
      hot: true,
      inline: true,
      contentBase: path.join(__dirname, "public"),
      port: 9090,
      proxy: {
        '/api': {
          // http://localhost:8080/api/users -> https://api.github.com/api/users
          target: 'https://api.github.com/',
          // 转发路径重写
          pathRewrite: {
            '^/api': ''
          },
          // 不能使用 本地的主机名 去请求 需要被代理 api
          changeOrigin: true
        }
      }
    },
    module: {
      rules: [
        {
          test: /.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              // 最新的 babel 不会导致 tree shaking 失效
              // presets: ['@babel/preset-env']
              // 我们任然可以强制设置为 'commonjs'
              presets: [
                // commonjs : 启用转换为 commonjs -> tree-shaking 失效，
                // false : 关闭 -> tree-shaking 生效
                ['@babel/preset-env', { modules: 'commonjs' }]
              ]
            }
          },
          exclude: /node_modules/
        },
        {
          test: /.css$/,
          use: [
            // 'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              }
            },
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
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'hello HtmlWebpackPlugin!',
        meta: {
          viewport: 'width=device-width'
        },
        template: './index.html',
        inject: true
      }),
      new MyPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'API_BASE_URL': '"api.example.com"'
      }),
      new MiniCssExtractPlugin({
        filename: '[name]-[contenthash:8].bundle.css',
      })
    ]
  }

  if (env.production) {
    logger('mode:production')
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: 'public', to: 'public' },
        ]
      }),
      new OptimizeCssAssetsWebpackPlugin(),
    ]
    config.optimization = {
      // 只输出被使用的成员
      usedExports: true,
      // 压缩输出结果
      minimize: true,
      // 尽可能合并每一个模块到一个函数种
      concatenateModules: true,
      sideEffects: true
    }
  }
  return config
}