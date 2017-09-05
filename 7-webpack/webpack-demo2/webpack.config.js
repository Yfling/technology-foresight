var htmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');

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
        exclude:path.resolve(__dirname,'/node_modules/'),
        include:path.resolve(__dirname,'/src'),
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
