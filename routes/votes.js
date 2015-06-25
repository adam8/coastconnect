var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var utility = require('../lib/utility');
var router = express.Router();


router.get('/', function (request, response) {
  rdb.findAll('votes')
  .then(function (votes) {
      response.json(votes);
  });
});

router.get('/:id', function (request, response, next) {
  rdb.find('votes', request.params.slug)
  .then(function (vote) {
    if(!vote) {
      var notFoundError = new Error('vote not found');
      notFoundError.status = 404;
      return next(notFoundError);
    }
    response.json(vote);
  });
});

router.post('/', auth.authorize, function (request, response) {
  if (!request.body.title.trim()) {
    response.status(500).json({ error: 'Title missing.' });
  }
  var slug = utility.slugify(request.body.title) + '-' + Math.floor(Math.random() * 1000000);
  // var lat = request.body.lat;
  // var long = request.body.long;
  var vote = {
    id: slug,
    title: request.body.title,
    text: request.body.text,
    date_added: (new Date).getTime()
    // location: long + ',' + lat
  };
  rdb.save('votes', vote)
  .then(function (result) {
    response.json(result);
  });
});

router.put('/:id', auth.authorize, function (request, response) {
  rdb.find('votes', request.params.id)
  .then(function (vote) {
    var updatedVote = {
      title: request.body.title || vote.title,
      text: request.body.text || vote.text
    };
    rdb.edit('votes', vote.id, updatedVote)
    .then(function (results) {
      response.json(results);
    });
  });
});

router.delete('/:id', auth.authorize, function (request, response) {
  rdb.destroy('votes', request.params.id)
  .then(function (results) {
        response.json(results);
    });
});


module.exports = router;
