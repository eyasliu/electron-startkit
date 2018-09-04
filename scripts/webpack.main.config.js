'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

const npmPackage = require('../package.json')

const env = process.env.NODE_ENV || 'development'

process.env.COMPILER_ENV = 'webpack'
console.log('npmPackage', npmPackage._moduleAliases)

const alias = {}

for (let [key, val] of Object.entries(npmPackage._moduleAliases)) {
  alias[key] = path.join(__dirname, '..', val)
}

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  mode: env,
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      // {
      //   test: /\.(js)$/,
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'eslint-loader',
      //     options: {
      //       formatter: require('eslint-friendly-formatter')
      //     }
      //   }
      // },
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.js', '.json', '.node'],
    alias: alias || {},
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  // mainConfig.plugins.push()
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin()
  )
}

module.exports = mainConfig
