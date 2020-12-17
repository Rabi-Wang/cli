export const proxy = {
  dev: {
    '/api/': {
      target: '',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    }
  },
  test: {

  },
  pro: {

  },
}
