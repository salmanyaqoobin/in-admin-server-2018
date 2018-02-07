const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const todoCtrl = require('./todo.controller.js');
const {authenticate} = require('./../middleware/authenticate');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/todos - Get list of todos per user */
  .get(authenticate, todoCtrl.list)

  /** POST /api/todos - Create new todos */
  .post(validate(paramValidation.createTodo), authenticate , todoCtrl.create);

router.route('/:todoId')
  /** GET /api/todos/:todoId - Get todos by id */
  .get(authenticate, todoCtrl.getTodo)

  /** patch /api/todos/:todoId - Update todos */
  .patch(authenticate, validate(paramValidation.updateTodo), todoCtrl.update)

  /** DELETE /api/todos/:todoId - Delete todos by user */
  .delete(authenticate, todoCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('todoId', todoCtrl.load);

module.exports = router;
