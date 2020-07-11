module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': ('src'),
        'assets': ('@/assets'),
        'common': '@/common',
        'components': '@components',
        'network': '@network',
        'views': '@views'
      }
    }
  },
  configureWebpack: {

    // other webpack options to merge in ...

  },

  // devServer Options don't belong into `configureWebpack`

  devServer: {

    public: '192.168.43.22:8080',

    hot: true,

    disableHostCheck: true,

  }
}
