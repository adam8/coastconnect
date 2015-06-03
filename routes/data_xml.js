var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');

var xml2js = require('xml2js');

var router = express.Router();

router.post('/', auth.authorize, function (request, response) {
//router.post('/', function (request, response) {
  
  // var ip = request.headers['x-forwarded-for'];
  // console.log('forwarded-for', request.headers['x-forwarded-for']);
  
  // if (ip !== '24.207.111.128') {
  //  response.json(result);
  // } else {
    console.log('request.body.data',request.body.data);
    
    var parseString = xml2js.parseString;
    var xml = request.body.data;
    var newEvents = [];
    
    parseString(xml, {trim: true}, function (err, result) {
      
        console.log('xml2json result: ', result);
      
        for (var i = 0; i < result.PublishMXASSETEM.MXASSETEMSet.length; i++) {
          var asset_status = result.PublishMXASSETEM.MXASSETEMSet[i].ASSET[0].STATUS[0]._;
          if (asset_status == "OPERATING") {
            var category = "operations";
          } else {
            var category = asset_status.toLowerCase();
          }
          var date = new Date(result.PublishMXASSETEM.$.creationDateTime)
          var newEvent = {
            time: date.getTime() / 1000,
            date: date,
            activity: result.PublishMXASSETEM.MXASSETEMSet[i].ASSET[0].DESCRIPTION[0],
            detail: '',
            category: category,
            priority: result.PublishMXASSETEM.MXASSETEMSet[i].ASSET[0].PRIORITY[0].$['xsi:nil'],
            deadline: null,
            lat: null,
            long: null,
            link: null
          };
          newEvents.push(newEvent);
        }
        
    });
  // }

  console.log('newEvents',newEvents);
  
  rdb.save('events', newEvents)
  .then(function (result) {
      response.json(result);
  });

});

module.exports = router;
