
const async = require('async');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const validator = require('validator');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var MediaSchema = new mongoose.Schema({
  originalFilename: String,
  src: String,
  path: String,
  size: String,
  type: String,
  name: String,
  uid: { type: mongoose.Schema.Types.ObjectId },
  uname: String,
  uemail: String,
  use: String,
  q: String,
  active: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
    versionKey: false,
    timestamps: true
  });

MediaSchema.pre('save', function (next) {
  this.q = this.originalFilename ? this.originalFilename + ' ' : ''
  this.q += this.src ? this.src + ' ' : ''
  this.q += this.path ? this.path + ' ' : ''
  this.q += this.size ? this.size + ' ' : ''
  this.q += this.type ? this.type + ' ' : ''
  this.q += this.name ? this.name + ' ' : ''
  this.q += this.uname ? this.uname + ' ' : ''
  this.q += this.uemail ? this.uemail + ' ' : ''
  this.q += this.use ? this.use + ' ' : ''
  this.q += ' '
  next();
});





/**
 * Methods
 */
MediaSchema.method({

  //toJSON(){
  //  var user = this;
  //  var userObject = user.toObject();
  //  return _.pick(userObject, ['_id', 'email']);
  //},
  toJSON(){
    var medua = this;
    var meduaObject = medua.toObject();
    //delete couponObject.couponQR;
    //return _.pick(userObject, ['_id', 'email']);
    return meduaObject;
  }

});

/**
 * Statics
 */
MediaSchema.statics = {
  /**
   * Get media
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<Media, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((media) => {
        if (media) {
          return media;
        }
        const err = new APIError('No such media exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List medias in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of media to be skipped.
   * @param {number} limit - Limit number of media to be returned.
   * @returns {Promise<Prize[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .select("-q")
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }

};

var Media = mongoose.model('Media', MediaSchema);
module.exports = {Media};
