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
    var flag_ids = user.flagged;
    console.log('flag_ids ' + flag_ids);
    
    return flag_ids;
    //r.table('events').getAll(r.args(flags)).run(conn, callback) 
    
    // rdb.findArray('events', user.flagged)
    // .then(function (events) {
    //   if(!events) {
    //     console.log('no flag event results');
    //     var notFoundError = new Error('No flags found');
    //     notFoundError.status = 404;
    //     return next(notFoundError);
    //   }
    //   console.log('flag events result',findArray);
    //   response.json(events);
    // });
    
    
  })
  .then(function (flag_ids) {
    console.log('flag_ids',flag_ids);
    return rdb.findArray('events', flag_ids);
  })
  .then(function (events) {
    console.log('last hop');
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

module.exports = router;