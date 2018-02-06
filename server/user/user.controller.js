'use strict';

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
var create = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var body, user, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            body = _.pick(req.body, ["name", 'email', 'password', 'mobileNumber']);
            user = new User(body);
            _context.next = 5;
            return user.save(function (err) {
              if (err && err.name === 'MongoError' && err.code === 11000) {
                var APIErr = new APIError('Email already exist!', httpStatus.BAD_REQUEST, true);
                next(APIErr);
                // Duplicate username
                //return res.status(500).send({ succes: false, message: 'User already exist!' });
              }
            });

          case 5:
            _context.next = 7;
            return user.generateAuthToken();

          case 7:
            token = _context.sent;

            res.header('x-auth', token).send(user);
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            _context.t0.message = "email already exist";
            //const err = new APIError('Signup error', httpStatus.BAD_REQUEST, true);
            //res.status(httpStatus.BAD_REQUEST).send(err);
            next(_context.t0);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function create(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */


var update = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var id, body, user, err;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.body._id;
            body = _.pick(req.body, ["name", 'mobileNumber', 'is_active']);
            _context2.prev = 2;
            _context2.next = 5;
            return User.findOneAndUpdate({
              _id: id
            }, { $set: body }, { new: true }).catch(function (e) {
              var err = new APIError('Update User id not found error', httpStatus.NOT_FOUND, true);
              res.status(httpStatus.NOT_FOUND).send(err);
            });

          case 5:
            user = _context2.sent;

            if (user) {
              _context2.next = 9;
              break;
            }

            err = new APIError('Update User id not found error', httpStatus.NOT_FOUND, true);
            return _context2.abrupt('return', res.status(httpStatus.NOT_FOUND).send(err));

          case 9:
            res.send({ user: user });
            _context2.next = 16;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](2);

            _context2.t0.message = 'Update User error';
            next(_context2.t0);
            //const err = new APIError('Update User error', httpStatus.BAD_REQUEST, true);
            //res.status(httpStatus.BAD_REQUEST).send(e);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 12]]);
  }));

  return function update(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */


/**
 * Logout user.
 */
var logout = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return req.user.removeToken(req.token);

          case 3:
            res.status(httpStatus.OK).send();
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3['catch'](0);

            res.status(httpStatus.BAD_REQUEST).send(_context3.t0);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 6]]);
  }));

  return function logout(_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Change user password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

var changePassword = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var user, userHashedPassword, changed;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return User.findById(req.user._id).select("_id email password");

          case 3:
            user = _context4.sent;
            userHashedPassword = User.hash(req.body.password, user.password);
            _context4.next = 7;
            return User.changePassword(user._id, req.body.password, req.body.newPassword, userHashedPassword);

          case 7:
            changed = _context4.sent;

            res.status(httpStatus.OK).send(changed);
            _context4.next = 14;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](0);

            res.status(httpStatus.BAD_REQUEST).send(_context4.t0);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 11]]);
  }));

  return function changePassword(_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./user.model'),
    User = _require.User;

var _ = require('lodash');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id).then(function (user) {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  User.list({ limit: limit, skip: skip }).then(function (users) {
    return res.json(users);
  }).catch(function (e) {
    return next(e);
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  var user = req.user;
  user.remove().then(function (deletedUser) {
    return res.json(deletedUser);
  }).catch(function (e) {
    return next(e);
  });
}

module.exports = { load: load, get: get, create: create, update: update, list: list, remove: remove, changePassword: changePassword, logout: logout };
//# sourceMappingURL=user.controller.js.map
