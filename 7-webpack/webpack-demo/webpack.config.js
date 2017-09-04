var htmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/script/main.js',
    a: './src/script/a.js'
  },
  output: {
    path: __dirname+'/dist/js',
    filename: '[name]-[chunkhash].js'      //此处为修改的地方
  },
  plugins: [
    new htmlwebpackPlugin({
      filename: 'index-[hash].html',
      template: 'index.html',
      inject: 'head'
    })
  ]
}
