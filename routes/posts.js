var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var utility = require('../lib/utility');
var router = express.Router();


router.get('/', auth.authorize, function (request, response) {
  rdb.findAll('posts')
  .then(function (posts) {
      response.json(posts);
  });
});

router.get('/:id', auth.authorize, function (request, response, next) {
  rdb.find('posts', request.params.slug)
  .then(function (post) {
    if(!post) {
      var notFoundError = new Error('Post not found');
      notFoundError.status = 404;
      return next(notFoundError);
    }
    response.json(post);
  });
});

router.post('/', auth.authorize, function (request, response) {
  if (!request.body.title.trim()) {
    response.status(500).json({ error: 'Title missing.' });
  }
  var slug = utility.slugify(request.body.title) + '-' + Math.floor(Math.random() * 1000000);
  var lat = request.body.lat;
  var long = request.body.long;
  var post = {
    id: slug,
    title: request.body.title,
    text: request.body.text,
    location: long + ',' + lat
  };
  rdb.save('posts', post)
  .then(function (result) {
    response.json(result); 
  });
});

router.put('/:id', auth.authorize, function (request, response) {
  rdb.find('posts', request.params.id)
  .then(function (post) {
    var updatedPost = {
      title: request.body.title || post.title,
      text: request.body.text || post.title
    };
    rdb.edit('posts', post.id, updatedPost)
    .then(function (results) {
      response.json(results);
    });
  });
});

router.delete('/:id', auth.authorize, function (request, response) {
  rdb.destroy('posts', request.params.id)
  .then(function (results) {
        response.json(results);
    });
});


module.exports = router;