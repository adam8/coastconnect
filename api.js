var bodyParser = require('body-parser')
var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
require('dotenv').load();


var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use('/users', users);
app.use('/login', login);

app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.json({ error: error.message });
});

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App is listening on http://%s:%s', host, port);
});
