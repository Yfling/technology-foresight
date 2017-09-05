var htmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname+'/dist/js',
    filename: 'js/[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude:__dirname +'./node_modules/',
        include:__dirname +'./src/',
        options: {
          'presets': ['env']
        }
      }
    ]
  },
  plugins: [
    new htmlwebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body'
    })
  ]
}
