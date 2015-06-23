var express = require('express');
var rdb = require('../lib/rethink');
var auth = require('../lib/auth');
var token = require('../lib/token');

var router = express.Router();

router.post('/', function (request, response, next) {
    rdb.findBy('users', 'email', request.body.email)
    .then(function (user) {
        user = user[0];

        if(!user) {
          var userNotFoundError = new Error('User not found');
          userNotFoundError.status = 404;
          return next(userNotFoundError);
        }
        
        // to create first user, create at /rethinkdb-admin
        // r.db('coasteasy').table('users').insert({"name":"Joe Blow", "email":"foo@bar.baz", "password":"hola"})
        // uncomment this next line (and comment out the rest of this function) to generate the token key, used as x-api-token header

        // response.json({'token':token.generate(user)});
        auth.authenticate(request.body.password, user.password)
        .then(function (authenticated) {
            if(authenticated) {
              var currentUser = {
                user: { 'id': user.id, 'email': user.email, 'name': user.name },
                token: token.generate(user) 
              };
              response.json(currentUser);
            } else {
              var authenticationFailedError = new Error('Authentication failed');
              authenticationFailedError.status = 401;
              return next(authenticationFailedError);
            }
        });
        
    });
});

module.exports = router;
