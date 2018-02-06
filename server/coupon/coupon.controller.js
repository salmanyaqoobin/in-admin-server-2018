'use strict';

/**
 * Load coupon and append to req.
 */
var load = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next, id) {
    var coupon, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ObjectID.isValid(id)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "coupon id is not valid" }));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return Coupon.findById(id);

          case 5:
            coupon = _context.sent;

            if (coupon) {
              _context.next = 9;
              break;
            }

            err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "Coupon not found" }));

          case 9:
            req.coupon = coupon; // eslint-disable-line no-param-reassign
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
 * Get coupon
 * @returns {Coupon}
 */


/**
 * Create new coupon
 * @property {string} req.body.title - The title of coupon.
 * @property {string} req.body.start_date - The start_date of coupon.
 * @property {string} req.body.end_date - The end_date of coupon.
 * @property {string} req.body.total_coupon_limit - The total_coupon_limit of coupon.
 * @returns {Coupon}
 */
var create = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, coupon, err;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            body = _.pick(req.body, ["title", 'start_date', 'end_date', 'coupon_type', "total_coupon_limit", "total_coupon_consumed", "region", "createdAt", "qr_status"]);
            coupon = new Coupon(body);
            _context2.next = 5;
            return coupon.save();

          case 5:
            res.send({ coupon: coupon });
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);
            err = new APIError('Create Coupon error', httpStatus.BAD_REQUEST, true);

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
 * Create new coupon
 * @property {string} req.body.title - The title of coupon.
 * @property {string} req.body.start_date - The start_date of coupon.
 * @property {string} req.body.end_date - The end_date of coupon.
 * @property {string} req.body.total_coupon_limit - The total_coupon_limit of coupon.
 * @returns {Coupon}
 */


var update = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var id, body, coupon, err, _err;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.coupon._id;
            body = _.pick(req.body, ["title", 'start_date', 'end_date', 'coupon_type', "total_coupon_limit", "region", "qr_status"]);
            _context3.prev = 2;
            _context3.next = 5;
            return Coupon.findOneAndUpdate({
              _id: id
            }, { $set: body }, { new: true }).catch(function (e) {
              var err = new APIError('Update coupon id not found error', httpStatus.NOT_FOUND, true);
              res.status(httpStatus.NOT_FOUND).send(err);
            });

          case 5:
            coupon = _context3.sent;

            if (coupon) {
              _context3.next = 9;
              break;
            }

            err = new APIError('Update coupon id not found error', httpStatus.NOT_FOUND, true);
            return _context3.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "Update coupon id not found error" }));

          case 9:
            res.send({ coupon: coupon });
            _context3.next = 16;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](2);
            _err = new APIError('Update coupon error', httpStatus.BAD_REQUEST, true);

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
 * Delete coupon.
 * @returns {Coupon}
 */


/**
 * Get qr
 * @returns {Coupon}
 */
var getQR = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var coupon, couponQR;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            coupon = req.coupon;
            _context4.prev = 1;
            _context4.next = 4;
            return Coupon.findById(coupon._id).select("couponQR").catch(function (e) {
              res.status(httpStatus.NOT_FOUND).send(e);
            });

          case 4:
            couponQR = _context4.sent;
            return _context4.abrupt('return', res.json(couponQR));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](1);

            res.status(httpStatus.BAD_REQUEST).send(_context4.t0);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 8]]);
  }));

  return function getQR(_x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Get qr Count
 * @returns {Coupon}
 */


var getQRCount = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var coupon, couponCount;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            coupon = req.coupon;
            _context5.prev = 1;
            couponCount = coupon.couponQR.length;
            return _context5.abrupt('return', res.json(couponCount));

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5['catch'](1);

            res.status(httpStatus.BAD_REQUEST).send(_context5.t0);

          case 9:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[1, 6]]);
  }));

  return function getQRCount(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Create new coupon QR
 * @property {number} req.body.qrStatus - The qrStatus of QR.
 * @property {number} req.body.total_qr - The total_qr of QR.
 * @returns {User}
 */


var createQR = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var body, coupon, couponCount, couponQR, err;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            body = _.pick(req.body, ["qrStatus", 'total_qr']);
            coupon = req.coupon;
            couponCount = coupon.couponQR.length;

            if (!(coupon.total_coupon_limit >= body.total_qr + couponCount)) {
              _context6.next = 11;
              break;
            }

            _context6.next = 7;
            return coupon.generateQR(body.qrStatus, body.total_qr).catch(function (e) {
              res.status(httpStatus.NOT_FOUND).send(e);
            });

          case 7:
            couponQR = _context6.sent;

            res.send(couponQR);
            _context6.next = 13;
            break;

          case 11:
            err = new APIError('requested QR limit is exceeding with total QR limit try again', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send({ message: 'requested QR limit is exceeding with total QR limit try again' });

          case 13:
            _context6.next = 19;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6['catch'](0);

            _context6.t0.message = "Create Coupon QR error";
            next(_context6.t0);
            //const err = new APIError('Create Coupon error', httpStatus.BAD_REQUEST, true);
            //res.status(httpStatus.BAD_REQUEST).send(err);

          case 19:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 15]]);
  }));

  return function createQR(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * Delete coupon.
 * @returns {Coupon}
 */


var removeQR = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var coupon, couponQRID, qr_remove, resError;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            coupon = req.coupon;
            couponQRID = req.params.couponQRID;

            console.log("couponQRID", couponQRID);
            console.log("_id", coupon._id);
            _context7.prev = 4;
            _context7.next = 7;
            return coupon.removeQR(couponQRID);

          case 7:
            qr_remove = _context7.sent;

            res.send(qr_remove);
            _context7.next = 15;
            break;

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7['catch'](4);
            resError = { "errors": { "some problem deleting QR code": [" try again"] } };

            res.status(httpStatus.BAD_REQUEST).send(resError);

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[4, 11]]);
  }));

  return function removeQR(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./coupon.model'),
    Coupon = _require.Coupon;

var _ = require('lodash');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

var _require2 = require('mongodb'),
    ObjectID = _require2.ObjectID;

function get(req, res) {
  return res.json(req.coupon);
}

/**
 * Get coupon list.
 * @property {number} req.query.skip - Number of coupons to be skipped.
 * @property {number} req.query.limit - Limit number of coupons to be returned.
 * @returns {Coupon[]}
 */
function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  Coupon.list({ limit: limit, skip: skip }).then(function (coupon) {
    return res.json(coupon);
  }).catch(function (e) {
    return next(e);
  });
}function remove(req, res, next) {
  var coupon = req.coupon;
  coupon.remove().then(function (deletedCoupon) {
    return res.json(deletedCoupon);
  }).catch(function (e) {
    return next(e);
  });
}

module.exports = { load: load, get: get, list: list, create: create, update: update, remove: remove, getQR: getQR, createQR: createQR, getQRCount: getQRCount, removeQR: removeQR };
//# sourceMappingURL=coupon.controller.js.map
