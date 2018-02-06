'use strict';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var login = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var body, user, token, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = _.pick(req.body, ['email', 'password']);
            _context.prev = 1;
            _context.next = 4;
            return User.findByCredentials(body.email, body.password);

          case 4:
            user = _context.sent;
            _context.next = 7;
            return user.generateAuthToken();

          case 7:
            token = _context.sent;

            res.header('x-auth', token).status(httpStatus.OK).send(user);
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](1);
            err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);

            res.status(httpStatus.BAD_REQUEST).send(_context.t0);
            //next(e);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 11]]);
  }));

  return function login(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */


var adminLogin = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, admin, token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = _.pick(req.body, ['email', 'password']);
            _context2.prev = 1;
            _context2.next = 4;
            return Admin.findByCredentials(body.email, body.password);

          case 4:
            admin = _context2.sent;
            _context2.next = 7;
            return admin.generateAuthToken();

          case 7:
            token = _context2.sent;

            res.header('x-auth', token).status(httpStatus.OK).send(admin);
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](1);

            //const err = new APIError('Authentication error', httpStatus.BAD_REQUEST, true);
            //const resError = {"errors":{"email or password":["invalid"]}};
            //res.status(httpStatus.BAD_REQUEST).send(resError);
            _context2.t0.message = "email or password invalid";
            next(_context2.t0);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 11]]);
  }));

  return function adminLogin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./../user/user.model'),
    User = _require.User;

var _require2 = require('./../admin/admin.model'),
    Admin = _require2.Admin;

var _ = require('lodash');
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../../config/config');function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login: login, getRandomNumber: getRandomNumber, adminLogin: adminLogin };
//# sourceMappingURL=auth.controller.js.map
