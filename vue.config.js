module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development',
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
