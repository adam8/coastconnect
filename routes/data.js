var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var router = express.Router();

router.post('/', auth.authorize, function (request, response) {
  
  var events = request.body.events;
  var newEvents = [];
  
  for (var i = 0; i < events.length; i++) {
    var newEvent = {
      time:events[i].time// ,
//       date: new Date(events[i].time * 1000),
//       category:events[i].category,
//       priority:events[i].priority,
//       deadline:events[i].deadline,
//       activity:events[i].activity,
//       detail:events[i].detail,
//       link:events[i].link
    };
    newEvents.push(newEvent);
  }

  console.log('events',events);
  console.log('newEvents',newEvents);

  response.json({'hola':'heya'});
  // rdb.save('events', newEvents)
  // .then(function (result) {
  //     response.json(result);
  // });

});

module.exports = router;
