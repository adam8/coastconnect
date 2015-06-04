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
    console.log("found user: " + user.name);
    console.log('flagged... ' + user.flagged);
    //r.table('events').getAll(r.args(flags)).run(conn, callback) 
    
    rdb.findArray('events', user.flagged)
    .then(function (events) {
      if(!events) {
        console.log('no flag event results');
        var notFoundError = new Error('No flags found');
        notFoundError.status = 404;
        return next(notFoundError);
      }
      console.log('flag events result',findArray);
      response.json(events);
    });
    
    
  });

});

module.exports = router;