const async = require('async');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 */

const UserSchema = new mongoose.Schema({
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

  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  mobileNumber: {
    type: String
    //required: true,
    //match: [/^[0-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },

  region: {
    type: String,
    enum: ["central", "northern", "western", "eastern", "southern"],
    default: "central"
  },
  city: {
    type: String,
    enum: ["riyadh", "madina", "makkah", "jeddah", "dammam"],
    default: "riyadh"
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
  coupons_consumed: [{
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    coupon_name: {
      type: String,
      required: true
    }
  }],
  prize_achieved: [{
    prize_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    prize_name: {
      type: String,
      required: true
    },
    prize_image: {
      type: String
    }
  }],
  points_achieved:{
    type: Number
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

const SALT_ROUNDS = 10;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */



/**
 * Pre-Save hooks
 */
UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//UserSchema.pre("update", function(next) {
//  const password = this.getUpdate().$set.password;
//  if (!password) {
//    return next();
//  }
//  try {
//    const salt = bcrypt.genSaltSync();
//    const hash = bcrypt.hashSync(password, salt);
//    this.getUpdate().$set.password = hash;
//    next();
//  } catch (error) {
//    return next(error);
//  }
//});


/**
 * Methods
 */
UserSchema.method({

  //toJSON(){
  //  var user = this;
  //  var userObject = user.toObject();
  //  return _.pick(userObject, ['_id', 'email']);
  //},
  toJSON(){
    var user = this;
    var userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
    //return _.pick(userObject, ['_id', 'email']);
  },

  generateAuthToken() {
    var user = this;
    var access = 'auth';

    // Generate a JWT token with _id, access = auth, expire for 1 hour.
    var token = jwt.sign({_id: user._id.toHexString(), access, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
      return token;
    });
  },

  removeToken(token) {
    var user = this;

    return user.update(
      { $pull:{ tokens:{token} } },
      { multi: true }
    ).catch((e)=>{Promise.reject(e)});
  }


});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  findByToken(token){
    var User = this;
    var decode;

    try{
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e){
      //return new Promise((resolve, reject)=>{
      //    reject();
      //});
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }

    return User.findOne({
      '_id': decode._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  },

  findByTokenPassword(token){
    var User = this;
    var decode;

    try{
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e){
      //return new Promise((resolve, reject)=>{
      //    reject();
      //});
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    }

    return User.findOne({
      '_id': decode._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    }).select("_id email password");
  },

  /**
   * Change user password
   * @param _id {string} - user id
   * @param currentPassword {string} - user current password
   * @param newPassword {string} - user new password
   * */
  //changePassword: (_id, currentPassword, newPassword) => new Promise((resolve, reject) => {
  //  async.waterfall([
  //    (callback) => {
  //      User.findWithPassword({ _id }, currentPassword).then((user) => {
  //        callback(null, user);
  //      }).catch(callback);
  //    },
  //    (user, callback) => {
  //      User.hash(currentPassword, user.password).then((passwordHash) => {
  //        callback(null, user._id, passwordHash);
  //      }).catch(callback);
  //    },
  //    (id, password, callback) => {
  //      User.updateOne({ _id: id }, { newPassword }).then((result) => {
  //        callback(null, result);
  //      }).catch(callback);
  //    }
  //  ], (err, result) => {
  //    if (err) return reject(err);
  //    return resolve(result);
  //  });
  //}),

  changePassword(_id, currentPassword, newPassword, userHashedPassword ){
    console.log("db pass", _id);
    return User.findWithPassword({_id:_id}, currentPassword).then((user)=> {
      if (!user) {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      }
      user.password = newPassword;
      user.save();
      console.log("user update");
      return Promise.resolve(user);
        //return new Promise((resolve, reject)=>{
        //  User.updateOne({_id: _id}, {password: newPassword}).then((result) => {
        //    console.log("done");
        //    return resolve(result);
        //  }).catch((e)=> {
        //    return reject(e);
        //  });
        //});
    });
  },


  /**
   * Find user by criteria and validate password
   * @param criteria {Object} - query object like {_id:"USER_ID", email:"user@mail.com}
   * @param password {string} - current user's password
   * @returns Promise
   * */
  findWithPassword: (criteria, password) => new Promise((resolve, reject) => {
    User.findOne(criteria).select('_id password email')
      .then((user) => {
        if (!user) {
          const err = new APIError('User with provided credentials not found', 401, true);
          return reject(err);
        }
        return bcrypt.compare(password, user.password).then((allow) => {
          if (!allow) {
            const err = new APIError('User with provided credentials not found', 401, true);
            return reject(err);
          }
          return resolve(user);
        });
      })
      .catch(reject);
  }),

  /**
   * Generate password hash using bcrypt
   * @param password {string}
   * @returns Promise
   * */
  hash: (password, userPassowrd) => new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassowrd, (err, res)=>{
      if(res){
        resolve(userPassowrd);
      } else {
        const err = new APIError('password not found', httpStatus.NOT_FOUND);
        reject(err);
      }
    });
  }),


  findByCredentials(email, password ){
    return User.findOne({email:email}).then((user)=>{
      if(!user){
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      }

      return new Promise( (resolve, reject)=>{
        bcrypt.compare(password, user.password, (err, res)=>{
          if(res){
            resolve(user);
          } else {
            const err = new APIError('password not found', httpStatus.NOT_FOUND);
            reject(err);
          }
        });
      });
    });
  }

};


/**
 * @typedef User
 */
var User = mongoose.model('User', UserSchema);
module.exports = {User};
//module.exports = mongoose.model('User', UserSchema);
