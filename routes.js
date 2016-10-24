'use strict'

const requestify = require('requestify')
const request = require('request').defaults({ encoding: null })
const mongojs = require('mongojs')
const config = require('./config')
const db = mongojs(config.mongodb)
const popularCollection = db.collection('popular')
const host = 'http://twitter-server.herokuapp.com'
const profileImageBaseUrl = 'http://pbs.twimg.com/profile_images'

// open graph defaults
const openGraph = {
  username: '@atgalleryapp',
  image: 'http://www.atgallery.me/atg-logo.png',
  proxiedImage: 'http://www.atgallery.me/atg-logo.png',
  title: 'Automatic Twitter Gallery',
  url: 'http://www.atgallery.me',
  description: 'Automatically generated image galleries for Twitter accounts.'
}

module.exports = function routes(app) {
  app.get('/', (req, res) => {
    res.render('index', openGraph)
  })

  app.get('/our-picks', (req, res) => {
    res.render('index', openGraph)
  })

  app.get('/twitter-profile-image/:id/:imageFile', (req, res) => {
    // sample profile image urls
    // http://pbs.twimg.com/profile_images/695361954018275330/RLTuGTD_.jpg
    // http://pbs.twimg.com/profile_images/378800000411656087/f62c09abd8af33b66c72ac98dac96e63.jpeg

    let id = req.params.id
    let imageFile = req.params.imageFile
    let url = `${profileImageBaseUrl}/${id}/${imageFile}`
    request(url, (error, response, body) => {
      // error
      if (error || response.statusCode !== 200) {
        return res.end()
      }

      // OK!
      return res.end(body, 'binary')
    })
  })

  app.get('/search/:query', (req, res) => {
    let query = req.params.query;
    let data = {
      username: openGraph.username,
      image: openGraph.image,
      proxiedImage: openGraph.image,
      title: `Search @ ${openGraph.title}`,
      url: `${openGraph.url}/search/${query}`,
      description: 'Searching Twitter in gallery format.'
    }
    res.render('index', data)
  })

  // special routing to allow open graph metas generation
  app.get('/gallery/:username', (req, res) => {
    let userAgent = req.get('User-Agent')
    let username = req.params.username
    let url = `${host}/user/${username}`
    let ttl = 10 // minutes
    console.log('--- open gallery for user:', username)
    console.log('--- user agent:', userAgent)

    requestify.request(url, {
      method: 'GET',
      cache: {
        cache: true,
        expires: 1000 * 60 * ttl
      },
      headers: {
        origin: openGraph.url
      },
      dataType: 'json'
    })
    .then((response) => {
      let user = response.getBody();
      let image = user.profile_image_url.replace('_normal', '');
      let proxiedImage = image.replace(profileImageBaseUrl, `${openGraph.url}/twitter-profile-image`)
      let data = {
        username: `@${username}`,
        image: image,
        proxiedImage: proxiedImage,
        title: `${openGraph.title} for ${username}`,
        url: `${openGraph.url}/gallery/${username}`,
        description: user.description || openGraph.description
      }
      res.render('index', data)
    })
    .fail((error) => {
      console.error('ERROR getting user:', error)
    })
  })

  //------------------------------------------------------------
  // API ROUTES

  app.patch('/api/popular/count', (req, res) => {
    let data = req.body
    let username = data.username

    // error
    if (!username) {
      res.sendStatus(500, 'ERROR: /api/gallery/count: username not provided!')
      return
    }

    console.log('-- PATCH | update count for user gallery:', data.name)
    popularCollection.update(
      {username: username},
      {
        $inc: {count: 1},
        $set: {
          name: data.name,
          description: data.description,
          background: data.background,
          updated: new Date()
        }
      },
      { upsert: true },
      (error, count) => {
        res
          .status(200)
          .json(count)
      }
    )
  })

  app.get('/api/popular', (req, res) => {
    console.log('-- get popular galleries')
    popularCollection.find()
      .limit(16)
      .sort({count: -1}, (error, docs) => {
        // handle error
        if (error) {
          return res
            .status(200)
            .json(error)
        }

        // OK
        res
          .status(200)
          .json(docs)
      })
  })
}
