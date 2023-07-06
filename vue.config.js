module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single'
    }
  },
  devServer: {
    host: 'localhost',
  },
}
