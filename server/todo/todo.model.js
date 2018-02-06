'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var validator = require('validator');

/**
 * Todos Schema
 */

var TodoScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  text: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: Date.now()
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Todo = mongoose.model('Todo', TodoScheme);

module.exports = { Todo: Todo };
//# sourceMappingURL=todo.model.js.map
