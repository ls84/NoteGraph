var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'app.js',
    path: './build'
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
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap!less-loader?sourceMap')
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'source-map-loader!babel-loader'
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin({ filename: 'main.css', allChunks: true })
  ]
}
