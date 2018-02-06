'use strict';

var async = require('async');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');

var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

/**
 * Admin Schema
 */

var AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "ADMIN", "MANAGER"],
    default: "MANAGER"
  },
  is_active: {
    type: String,
    enum: ["ACTIVE", "IN-ACTIVE"],
    default: "ACTIVE"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

var SALT_ROUNDS = 10;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Pre-Save hooks
 */
AdminSchema.pre('save', function (next) {
  var admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(admin.password, salt, function (err, hash) {
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * Methods
 */
AdminSchema.method({

  //toJSON(){
  //  var admin = this;
  //  var userObject = admin.toObject();
  //  return _.pick(userObject, ['_id', 'email']);
  //},
  toJSON: function toJSON() {
    var admin = this;
    var userObject = admin.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
    //return _.pick(userObject, ['_id', 'email']);
  },
  generateAuthToken: function generateAuthToken() {
    var admin = this;
    var access = 'auth';

    // Generate a JWT token with _id, access = auth, expire for 1 hour.
    var token = jwt.sign({ _id: admin._id.toHexString(), access: access, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, process.env.JWT_SECRET).toString();

    admin.tokens.push({ access: access, token: token });

    return admin.save().then(function () {
      return token;
    });
  },
  removeToken: function removeToken(token) {
    var admin = this;

    return admin.update({ $pull: { tokens: { token: token } } }, { multi: true }).catch(function (e) {
      Promise.reject(e);
    });
  }
});

/**
 * Statics
 */
AdminSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).exec().then(function (admin) {
      if (admin) {
        return admin;
      }
      var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },


  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit;

    return this.find().select("_id name email role is_active createdAt").sort({ createdAt: -1 }).skip(+skip).limit(+limit).exec();
  },
  findByToken: function findByToken(token) {
    var Admin = this;
    var decode;

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      //return new Promise((resolve, reject)=>{
      //    reject();
      //});
      var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }

    return Admin.findOne({
      '_id': decode._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  },
  findByTokenPassword: function findByTokenPassword(token) {
    var Admin = this;
    var decode;

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      //return new Promise((resolve, reject)=>{
      //    reject();
      //});
      var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }

    return Admin.findOne({
      '_id': decode._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    }).select("_id email password");
  },
  changePassword: function changePassword(_id, currentPassword, newPassword, userHashedPassword) {
    console.log("db pass", _id);
    return Admin.findWithPassword({ _id: _id }, currentPassword).then(function (admin) {
      if (!admin) {
        var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      }
      admin.password = newPassword;
      admin.save();
      console.log("user update");
      return Promise.resolve(admin);
    });
  },


  /**
   * Find user by criteria and validate password
   * @param criteria {Object} - query object like {_id:"USER_ID", email:"user@mail.com}
   * @param password {string} - current user's password
   * @returns Promise
   * */
  findWithPassword: function findWithPassword(criteria, password) {
    return new Promise(function (resolve, reject) {
      Admin.findOne(criteria).select('_id password email').then(function (admin) {
        if (!admin) {
          var err = new APIError('User with provided credentials not found', 401, true);
          return reject(err);
        }
        return bcrypt.compare(password, admin.password).then(function (allow) {
          if (!allow) {
            var _err = new APIError('User with provided credentials not found', 401, true);
            return reject(_err);
          }
          return resolve(admin);
        });
      }).catch(reject);
    });
  },

  /**
   * Generate password hash using bcrypt
   * @param password {string}
   * @returns Promise
   * */
  hash: function hash(password, userPassowrd) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, userPassowrd, function (err, res) {
        if (res) {
          resolve(userPassowrd);
        } else {
          var _err2 = new APIError('password not found', httpStatus.NOT_FOUND);
          reject(_err2);
        }
      });
    });
  },

  findByCredentials: function findByCredentials(email, password) {
    return Admin.findOne({ email: email }).then(function (admin) {
      if (!admin) {
        var err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      }

      return new Promise(function (resolve, reject) {
        bcrypt.compare(password, admin.password, function (err, res) {
          if (res) {
            resolve(admin);
          } else {
            var _err3 = new APIError('password not found', httpStatus.NOT_FOUND, true);
            reject(_err3);
          }
        });
      });
    });
  }
};

/**
 * @typedef User
 */
var Admin = mongoose.model('Admin', AdminSchema);
module.exports = { Admin: Admin };
//module.exports = mongoose.model('User', AdminSchema);
//# sourceMappingURL=admin.model.js.map
