'use strict';

/**
 * Load prize and append to req.
 */
var load = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next, id) {
    var prize, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ObjectID.isValid(id)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "prize id is not valid" }));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return Prize.findById(id);

          case 5:
            prize = _context.sent;

            if (prize) {
              _context.next = 9;
              break;
            }

            err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "Coupon not found" }));

          case 9:
            req.prize = prize; // eslint-disable-line no-param-reassign
            return _context.abrupt('return', next());

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](2);

            next(_context.t0);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 13]]);
  }));

  return function load(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Get prize
 * @returns {Prize}
 */


/**
 * Create new prize
 * @property {string} req.body.title - The title of prize.
 * @property {string} req.body.prize_image - The prize_image of prize.
 * @property {string} req.body.prize_type - The prize_type of prize.
 * @property {number} req.body.total_quantity - The total_quantity of prize.
 * @property {number} req.body.total_points - The total_points of prize.
 * @property {string} req.body.region - The region of prize.
 * @property {string} req.body.limit_per_day - The limit_per_day of prize.
 * @property {string} req.body.prize_value - The prize_value of prize.
 * @property {string} req.body.prize_status - The prize_status of prize.
 *
 * @returns {Prize}
 */
var create = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, prize, err;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            body = _.pick(req.body, ["title", 'prize_image', 'prize_type', 'total_quantity', "total_points", "region", "limit_per_day", "prize_value", "prize_status"]);
            prize = new Prize(body);
            _context2.next = 5;
            return prize.save();

          case 5:
            res.send(prize);
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);
            err = new APIError('Create Prize error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send(err);
            //next(e);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 8]]);
  }));

  return function create(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Update new prize
 * @property {string} req.body.title - The title of prize.
 * @property {string} req.body.prize_image - The prize_image of prize.
 * @property {string} req.body.prize_type - The prize_type of prize.
 * @property {number} req.body.total_quantity - The total_quantity of prize.
 * @property {number} req.body.total_points - The total_points of prize.
 * @property {string} req.body.region - The region of prize.
 * @property {string} req.body.limit_per_day - The limit_per_day of prize.
 * @property {string} req.body.prize_value - The prize_value of prize.
 * @property {string} req.body.prize_status - The prize_status of prize.
 *
 * @returns {Prize}
 */


var update = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var id, body, prize, err, _err;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.prize._id;
            body = _.pick(req.body, ["title", 'prize_image', 'prize_type', 'total_quantity', "total_points", "region", "limit_per_day", "prize_value", "prize_status"]);
            _context3.prev = 2;
            _context3.next = 5;
            return Prize.findOneAndUpdate({
              _id: id
            }, { $set: body }, { new: true }).catch(function (e) {
              var err = new APIError('Update prize id not found error', httpStatus.NOT_FOUND, true);
              res.status(httpStatus.NOT_FOUND).send(err);
            });

          case 5:
            prize = _context3.sent;

            if (prize) {
              _context3.next = 9;
              break;
            }

            err = new APIError('Update prize id not found error', httpStatus.NOT_FOUND, true);
            return _context3.abrupt('return', res.status(httpStatus.NOT_FOUND).send(err));

          case 9:
            res.send({ prize: prize });
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](2);
            _err = new APIError('Update prize error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send(_context3.t0);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[2, 12]]);
  }));

  return function update(_x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Delete prize.
 * @returns {Prize}
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./prize.model'),
    Prize = _require.Prize;

var _ = require('lodash');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

var _require2 = require('mongodb'),
    ObjectID = _require2.ObjectID;

function get(req, res) {
  return res.json(req.prize);
}

/**
 * Get prize list.
 * @property {number} req.query.skip - Number of prizes to be skipped.
 * @property {number} req.query.limit - Limit number of prizes to be returned.
 * @returns {Prize[]}
 */
function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  Prize.list({ limit: limit, skip: skip }).then(function (prize) {
    return res.json(prize);
  }).catch(function (e) {
    return next(e);
  });
}function remove(req, res, next) {
  var prize = req.prize;
  prize.remove().then(function (deletedPrize) {
    return res.json(deletedPrize);
  }).catch(function (e) {
    return next(e);
  });
}

module.exports = { load: load, get: get, list: list, create: create, update: update, remove: remove };
//# sourceMappingURL=prize.controller.js.map
