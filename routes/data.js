var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var router = express.Router();

router.post('/', auth.authorize, function (request, response) {

  var newEvent = {
    time:1431742298.993,
    category:"maintenance",
    priority:null,
    deadline:null,
    activity:"new activity, it worked!",
    detail:"new detail here",
    link:null
  };

  console.log(newEvent);

  rdb.save('events', newEvent)
  .then(function (result) {
      response.json(result);
  });

});

module.exports = router;
