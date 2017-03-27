var webpackConfig = require('./webpack.config.js')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/index.js',
      'externals/d3.js',
      {pattern: 'style/main.less', watched: false, included: true, served: true}
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
