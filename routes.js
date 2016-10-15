var requestify = require('requestify');
var request = require('request').defaults({ encoding: null });
module.exports = routes;

var host = 'http://twitter-server.herokuapp.com';
var profileImageBaseUrl = 'http://pbs.twimg.com/profile_images';

// open graph defaults
var openGraph = {
  username: '@atgalleryapp',
  image: 'http://www.atgallery.me/atg-logo.png',
  proxiedImage: 'http://www.atgallery.me/atg-logo.png',
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

  app.get('/twitter-profile-image/:id/:imageFile', (req, res) => {
    // sample profile image urls
    // http://pbs.twimg.com/profile_images/695361954018275330/RLTuGTD_.jpg
    // http://pbs.twimg.com/profile_images/378800000411656087/f62c09abd8af33b66c72ac98dac96e63.jpeg

    var id = req.params.id;
    var imageFile = req.params.imageFile;
    var url = `${profileImageBaseUrl}/${id}/${imageFile}`;
    request(url, (error, response, body) => {
      // error
      if (error || response.statusCode !== 200) {
        return res.end();
      }

      // OK!
      return res.end(body, 'binary');
    });
  });

  app.get('/search/:query', (req, res) => {
    var query = req.params.query;
    var data = {
      username: openGraph.username,
      image: openGraph.image,
      proxiedImage: openGraph.image,
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
      var image = user.profile_image_url.replace('_normal', '');
      var proxiedImage = image.replace(profileImageBaseUrl, `${openGraph.url}/twitter-profile-image`);
      var data = {
        username: `@${username}`,
        image: image,
        proxiedImage: proxiedImage,
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
