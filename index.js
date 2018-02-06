'use strict';

var mongoose = require('mongoose');
var util = require('util');

// config should be imported before importing any other file
var config = require('./config/config');
var app = require('./config/express');
var http = require("http");

var debug = require('debug')('express-admin:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
var mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + mongoUri);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', function (collectionName, method, query, doc) {
    debug(collectionName + '.' + method, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port

  app.listen(config.port, function () {
    console.info('server started on port ' + config.port + ' (' + config.env + ')'); // eslint-disable-line no-console
  });
}

module.exports = app;
//# sourceMappingURL=index.js.map
