module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    workboxOptions: {
      exclude: [/_redirects/]
    }
  },
  publicPath: './',//process.env.NODE_ENV === 'production' ? '/' + process.env.CI_PROJECT_NAME + '/' : '/'
}
