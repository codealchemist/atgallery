module.exports = (function config () {
  const map = {
    dev: {
      mongodb: 'mongodb://localhost:27017/atgallery',
    },
    prod: {
      mongodb: 'mongodb://heroku_gmsplqsq:otca2t1mmuot4btangd8t11l8e@ds031157.mlab.com:31157/heroku_gmsplqsq',
    }
  }

  if (process.env.PROD) return map.prod
  return map.dev
})()
