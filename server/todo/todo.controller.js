'use strict';

/**
 * Load user and append to req.
 */
var load = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next, id) {
    var todo, err;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ObjectID.isValid(id)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send({ error: "id is not valid" }));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return Todo.findById(id);

          case 5:
            todo = _context.sent;

            if (todo) {
              _context.next = 9;
              break;
            }

            err = new APIError('Todo not found', httpStatus.NOT_FOUND, true);
            return _context.abrupt('return', res.status(httpStatus.NOT_FOUND).send(err));

          case 9:
            req.todo = todo; // eslint-disable-line no-param-reassign
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
 * Get user
 * @returns {todos}
 */


/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
var create = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, todoData, todo, err;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            body = _.pick(req.body, ["title", 'text']);
            todoData = new Todo({
              title: body.title,
              text: body.text,
              completed: false,
              _creator: req.user._id
            });
            _context2.next = 5;
            return todoData.save();

          case 5:
            todo = _context2.sent;

            res.send(todo);

            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);
            err = new APIError('Create Todos error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send(err);

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
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */


var update = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var id, body, todo, err, _err;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.todo._id;
            body = _.pick(req.body, ["title", "text", "completed"]);
            _context3.prev = 2;

            if (_.isBoolean(body.completed) && body.completed) {
              body.completedAt = Date.now();
            } else {
              body.completed = false;
              body.completedAt = null;
            }

            _context3.next = 6;
            return Todo.findOneAndUpdate({
              _id: id,
              _creator: req.user._id
            }, { $set: body }, { new: true }).catch(function (e) {
              var err = new APIError('Update Todos id not found error', httpStatus.NOT_FOUND, true);
              res.status(httpStatus.NOT_FOUND).send(err);
            });

          case 6:
            todo = _context3.sent;

            if (todo) {
              _context3.next = 10;
              break;
            }

            err = new APIError('Update Todos id not found error', httpStatus.NOT_FOUND, true);
            return _context3.abrupt('return', res.status(httpStatus.NOT_FOUND).send(err));

          case 10:
            res.send({ todo: todo });
            _context3.next = 17;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](2);
            _err = new APIError('Update Todos error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send(_context3.t0);

          case 17:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[2, 13]]);
  }));

  return function update(_x8, _x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */


/**
 * Delete user.
 * @returns {User}
 */
var remove = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var todo, todoRemove, err, _err2;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            todo = req.todo;
            //todo.remove()
            //  .then(deletedUser => res.json(deletedUser))
            //  .catch(e => next(e));

            _context4.prev = 1;
            _context4.next = 4;
            return Todo.findOneAndRemove({
              _id: todo._id,
              _creator: req.user._id
            });

          case 4:
            todoRemove = _context4.sent;

            if (todoRemove) {
              _context4.next = 8;
              break;
            }

            err = new APIError('Delete Todos not found error', httpStatus.NOT_FOUND, true);
            return _context4.abrupt('return', res.status(httpStatus.NOT_FOUND).send(err));

          case 8:
            res.send({ todo: todoRemove });
            _context4.next = 15;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4['catch'](1);
            _err2 = new APIError('Delete Todos error', httpStatus.BAD_REQUEST, true);

            res.status(httpStatus.BAD_REQUEST).send(_err2);

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 11]]);
  }));

  return function remove(_x11, _x12, _x13) {
    return _ref4.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./todo.model.js'),
    Todo = _require.Todo;

var _ = require('lodash');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

var _require2 = require('mongodb'),
    ObjectID = _require2.ObjectID;

function getTodo(req, res) {

  if (req.todo._creator.toHexString() !== req.user._id.toHexString()) {
    var err = new APIError('Get Todos with unauthorized user error', httpStatus.NOT_FOUND, true);
    return res.status(httpStatus.NOT_FOUND).send(err);
  }
  return res.json({ todo: req.todo });
}function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$skip = _req$query.skip,
      skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  limit = parseInt(limit);
  skip = parseInt(skip);
  //Todo.list({ limit, skip })
  //  .then(todos => res.json(todos))
  //  .catch(e => next(e));

  Todo.find({ _creator: req.user._id }, {}, { limit: limit, skip: skip }).then(function (todos) {
    return res.json(todos);
  }).catch(function (e) {
    res.status(400).send(e);
    //next(e);
  });
}

module.exports = { load: load, getTodo: getTodo, create: create, update: update, list: list, remove: remove };
//# sourceMappingURL=todo.controller.js.map
