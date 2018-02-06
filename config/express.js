'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var httpStatus = require('http-status');
var expressWinston = require('express-winston');
var expressValidation = require('express-validation');
var helmet = require('helmet');
var winstonInstance = require('./winston');
var routes = require('../index.route');
var config = require('./config');
var APIError = require('../server/helpers/APIError');

var app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

if (config.env === 'test') {
  config.mongo.host = "mongodb://localhost/express-admin-test";
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

var corsOptions = {
  exposedHeaders: 'x-auth'
};
// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance: winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

//create a cors middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

// Send all other requests to the Angular app
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'dist/index.html'));
//});

//app.use(express.static(__dirname + "/dist"));

// mount all routes on /api path
app.use('/api', routes);

app.use('/uploads', express.static('uploads'));

// if error is not an instanceOf APIError, convert it.
app.use(function (err, req, res, next) {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    var unifiedErrorMessage = err.errors.map(function (error) {
      return error.messages.join('. ');
    }).join(' and ');
    var error = new APIError(unifiedErrorMessage, err.status, true);
    //const newError = {"errors":{unifiedErrorMessage: ["invalid"]}};
    return next(error);
  } else if (!(err instanceof APIError)) {
    var apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance: winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use(function (err, req, res, next) {
  return (// eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env === 'development' ? err.stack : {}
    })
  );
});

module.exports = app;
//# sourceMappingURL=express.js.map
