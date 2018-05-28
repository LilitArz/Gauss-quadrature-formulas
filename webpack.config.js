const HtmlWebpackPlugin = require('html-webpack-plugin')
const { version } = require('./version.json')
const webpack = require('webpack')

const nodeEnv = process.env.NODE_ENV || 'development'
const buildPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  __VERSION__: JSON.stringify(version)
})

module.exports = {
  entry: './src/app',
  output: {
    path: __dirname + '/dist',
    filename: 'landing-1.0.0.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    buildPlugin
  ],
  devServer: {
    disableHostCheck: true
  }
}
