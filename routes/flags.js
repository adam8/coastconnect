var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var router = express.Router();

router.get('/:id', auth.authorize, function (request, response, next) {
  rdb.find('users', request.params.id)
  .then(function (user) {
    if(!user) {
      var notFoundError = new Error('User not found');
      notFoundError.status = 404;
      return next(notFoundError);
    }
    var flag_ids = user.flagged;
    return flag_ids;
  })
  .then(function (flag_ids) {
    return rdb.findArray('events', flag_ids);
  })
  .then(function (events) {
    console.log('last hop: ', events);
    if(!events) {
      console.log('no flag event results');
      var notFoundError = new Error('No flags found');
      notFoundError.status = 404;
      return next(notFoundError);
    }
    console.log('done!?');
    return response.json(events);  
  });
});

module.exports = router;