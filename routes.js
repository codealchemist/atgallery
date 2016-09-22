var requestify = require('requestify');
module.exports = routes;

var host = 'http://twitter-server.herokuapp.com';
var accessToken = '3db44bf3-008f-4dd4-9408-bf5ceadb9883';

// open graph defaults
var openGraph = {
  image: 'https://atgallery.herokuapp.com/atg-logo.png',
  title: 'Automatic Twitter Gallery',
  url: 'https://atgallery.herokuapp.com',
  description: 'Automatically generated image galleries for Twitter accounts.'
};

function routes(app) {
  app.get('/', (req, res) => {
    res.render('index', openGraph);
  });

  app.get('/our-picks', (req, res) => {
    res.render('index', openGraph);
  });

  // special routing to allow open graph metas generation
  app.get('/gallery/:username', (req, res) => {
    var userAgent = req.get('User-Agent');
    var username = req.params.username;
    var url = `${host}/user/${username}`;
    var ttl = 10; // minutes
    console.log('--- open gallery for user:', username);
    console.log('--- user agent:', userAgent);

    requestify.request(url, {
      method: 'GET',
      cache: {
        cache: true,
        expires: 1000 * 60 * ttl
      },
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      dataType: 'json'
    })
    .then((response) => {
      var user = response.getBody();
      var data = {
        image: user.profile_image_url.replace('_normal', ''),
        title: `${openGraph.title} for ${username}`,
        url: `${openGraph.url}/gallery/${username}`,
        description: user.description
      };
      res.render('index', data);
    })
    .fail((error) => {
      console.error('ERROR getting user:', error);
    });
  });
}
