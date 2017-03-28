var webpackConfig = require('./webpack.config.js')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'externals/d3.js',
      'externals/react.js',
      'externals/react-dom.js',
      'externals/gun.js',
      {pattern: 'style/main.less', watched: false, included: true, served: true},
      'test/index.js'
    ],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
      'style/main.less': ['less']
    },
    webpack: webpackConfig,
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity
  })
}
