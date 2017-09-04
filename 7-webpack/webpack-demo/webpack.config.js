var htmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/script/main.js',
    a: './src/script/a.js',
    b: './src/script/b.js',
    c: './src/script/c.js',
  },
  output: {
    path: __dirname+'/dist/js',
    filename: '[name]-[chunkhash].js',     //此处为修改的地方
    publicPath: 'http://cdn.com/'
  },
  plugins: [
    new htmlwebpackPlugin({
      filename: 'a.html',
      template: 'index.html',
      inject: 'body',
      title: 'this ia a.html',
      chunks: ['main', 'a']
    }),
    new htmlwebpackPlugin({
      filename: 'b.html',
      template: 'index.html',
      inject: 'body',
      title: 'this ia b.html',
      chunks: ['b']
    }),
    new htmlwebpackPlugin({
      filename: 'c.html',
      template: 'index.html',
      inject: 'body',
      title: 'this is c.html',
      chunks: ['c']
    }),
  ]
}
