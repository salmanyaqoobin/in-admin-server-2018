'use strict';

/**
 * Load media and append to req.
 */
var load = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next, id) {
    var media, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ObjectID.isValid(id)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "media id is not valid" }));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return Media.findById(id);

          case 5:
            media = _context.sent;

            if (media) {
              _context.next = 9;
              break;
            }

            err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ message: "media not found" }));

          case 9:
            req.media = media; // eslint-disable-line no-param-reassign
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
 * Get media
 * @returns {Media}
 */


/**
 * Create new media
 * @property {string} req.body.originalFilename - The originalFilename of media.
 * @property {string} req.body.src - The src of media.
 * @property {string} req.body.path - The path of media.
 * @property {string} req.body.size - The size of media.
 *
 * @property {string} req.body.type - The type of media.
 * @property {string} req.body.name - The name of media.
 * @property {string} req.body.uid - The uid of media.
 * @property {string} req.body.uname - The uname of media.
 * @property {string} req.body.uemail - The uemail of media.
 * @property {string} req.body.active - The active of media.
 *
 * @returns {Media}
 */
var create = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, media, err;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            req.body = req.files.photo;
            body = _.pick(req.body, ["originalFilename", 'src', 'path', 'size', "type", "name", "uid", "uname", "uemail", "active"]);
            media = new Media(body);
            _context2.next = 6;
            return media.save();

          case 6:
            res.send(media);
            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);

            //e.message = 'Create Media error';
            //next(e);
            err = new APIError('Create Media error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send({ message: "Media upload error." });
            //next(e);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 9]]);
  }));

  return function create(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Delete media.
 * @returns {Media}
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./media.model'),
    Media = _require.Media;

var _ = require('lodash');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

var _require2 = require('mongodb'),
    ObjectID = _require2.ObjectID;

var multer = require('multer');

var DIR = './uploads/';
var upload = multer({ dest: DIR }).single('photo');function get(req, res) {
  return res.json(req.media);
}

/**
 * Get media list.
 * @property {number} req.query.skip - Number of coupons to be skipped.
 * @property {number} req.query.limit - Limit number of coupons to be returned.
 * @returns {Media[]}
 */
function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  Media.list({ limit: limit, skip: skip }).then(function (media) {
    return res.json(media);
  }).catch(function (e) {
    return next(e);
  });
}function remove(req, res, next) {
  var media = req.media;
  media.remove().then(function (deletedMedia) {
    return res.json(deletedMedia);
  }).catch(function (e) {
    return next(e);
  });
}

module.exports = { load: load, get: get, list: list, create: create, remove: remove };
//# sourceMappingURL=media.controller.js.map
