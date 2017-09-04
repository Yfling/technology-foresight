var htmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/script/main.js',
    a: './src/script/a.js'
  },
  output: {
    path: __dirname+'/dist/js',
    filename: '[name]-[chunkhash].js',     //此处为修改的地方
    publicPath: 'http://cdn.com/'
  },
  plugins: [
    new htmlwebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: false,
      title: 'webpack is good',
      date: new Date(),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
}
