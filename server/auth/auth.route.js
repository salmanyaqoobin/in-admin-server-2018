'use strict';

var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../../config/param-validation');
var authCtrl = require('./auth.controller');
var config = require('../../config/config');

var router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login').post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/admin/login - Returns token if correct username and password is provided */
router.route('/admin/login').post(validate(paramValidation.login), authCtrl.adminLogin);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number').get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

module.exports = router;
//# sourceMappingURL=auth.route.js.map
