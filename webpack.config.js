module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'app.js',
    path: __dirname + '/dist/bundle'
  },
  externals: {
    'd3': 'd3',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'gun': 'Gun'
  },
  module: {
    rules: [
      {
       enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'source-map-loader!babel-loader'
      }
    ]
  },
  devServer:{
    host: '0.0.0.0',
    contentBase: __dirname + '/dist',
    publicPath: '/bundle/',
    watchContentBase: true
  },
  devtool: 'inline-source-map'
}
