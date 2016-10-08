var requestify = require('requestify');
module.exports = routes;

var host = 'http://twitter-server.herokuapp.com';

// open graph defaults
var openGraph = {
  image: 'http://www.atgallery.me/atg-logo.png',
  title: 'Automatic Twitter Gallery',
  url: 'http://www.atgallery.me',
  description: 'Automatically generated image galleries for Twitter accounts.'
};

function routes(app) {
  app.get('/', (req, res) => {
    res.render('index', openGraph);
  });

  app.get('/our-picks', (req, res) => {
    res.render('index', openGraph);
  });

  app.get('/search/:query', (req, res) => {
    var query = req.params.query;
    var data = {
      image: openGraph.image,
      title: `Search @ ${openGraph.title}`,
      url: `${openGraph.url}/search/${query}`,
      description: 'Searching Twitter in gallery format.'
    };
    res.render('index', data);
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
        origin: openGraph.url
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
