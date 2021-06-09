module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://ceshi.fc225.info/',
        // target: 'https://api.qinaw.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        },
        headers: {
          Connection: 'keep-alive'
        }
      }
    }
  },
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
