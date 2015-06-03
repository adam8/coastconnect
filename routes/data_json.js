var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var router = express.Router();

//router.post('/', auth.authorize, function (request, response) {
router.post('/', function(request, response) {
  
  // var ip = request.headers['x-forwarded-for'];
  // console.log('forwarded-for', request.headers['x-forwarded-for']);
  
  // if (ip !== '24.207.111.128') {
  //  response.json(result);
  // } else {
    var events = request.body;
    var newEvents = [];
    for (var i = 0; i < events.length; i++) {
      var newEvent = {
        time:events[i].time,
        date: new Date(events[i].time),
        activity:events[i].activity,
        detail:events[i].detail,
        category:events[i].category,
        priority:events[i].priority,
        deadline:events[i].deadline,
        lat: events[i].lat,
        long: events[i].long,
        link:events[i].link
      };
      newEvents.push(newEvent);
    }
  // }

  rdb.save('events', newEvents)
  .then(function (result) {
      response.json(result);
  });

});

module.exports = router;
