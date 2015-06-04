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

    // rdb.findArray('events', user.flagged)
    // .then(function (flags) {
    //   if(!flags) {
    //     console.log('no flag results');
    //     var notFoundError = new Error('No flags found');
    //     notFoundError.status = 404;
    //     return next(notFoundError);
    //   }
    //   console.log('flag result',findArray);
    //   response.json(flags);
    // });
    
    response.json(rdb.table('events').getAll(r.args([ '46dfb2f0-89e7-461b-82a5-e0dbc2a97cd3',
    '8bd2202a-7854-4c9f-b2ff-12b9513c883e' ])).run(connection)); 
    
  });
});

module.exports = router;