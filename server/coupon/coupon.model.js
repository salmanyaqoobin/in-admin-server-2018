'use strict';

var async = require('async');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var validator = require('validator');
var _ = require('lodash');

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

/**
 * Coupon Schema
 */

var CouponScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  start_date: {
    type: Date,
    default: Date.now(),
    required: true
  },

  end_date: {
    type: Date,
    default: Date.now(),
    required: true
  },

  coupon_type: {
    type: String,
    enum: ["in-store", "social", "wifi"],
    default: "in-store"
  },
  total_coupon_limit: {
    type: Number,
    default: 1,
    required: true
  },
  total_coupon_consumed: {
    type: Number,
    default: 0
  },
  region: {
    type: String,
    enum: ["central", "northern", "western", "eastern", "southern"],
    default: "central"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  couponQR: [{
    qr_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    qrStatus: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
      required: true
    },
    coupon_prizes: [{
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
      },
      prize_value: {
        type: String
      }
    }]

  }],
  coupon_status: {
    type: String,
    enum: ['active', 'in-active', 'completed'],
    default: "active"
  }
});

/**
 * Methods
 */
CouponScheme.method({

  //toJSON(){
  //  var user = this;
  //  var userObject = user.toObject();
  //  return _.pick(userObject, ['_id', 'email']);
  //},
  toJSON: function toJSON() {
    var coupon = this;
    var couponObject = coupon.toObject();
    //delete couponObject.couponQR;
    return couponObject;
    //return _.pick(userObject, ['_id', 'email']);
  },
  generateQR: function generateQR(qrStatus, total_qr) {
    var coupon = this;
    for (var i = 1; i <= total_qr; i++) {
      coupon.couponQR.push({ qr_id: new ObjectID(), qrStatus: qrStatus });
    }
    return coupon.save().then(function () {
      return coupon;
    });
  },
  removeQR: function removeQR(qr_id) {
    var coupon = this;

    return coupon.update({ $pull: { couponQR: { qr_id: qr_id } } }, { multi: true }).catch(function (e) {
      Promise.reject(e);
    });
  },
  countQR: function countQR() {
    var coupon = this;
    var aggregatorOpts = [{
      $unwind: "$couponQR"
    }, {
      $group: {
        count: { $sum: 1 }
      }
    }];
    var count = coupon.aggregate(aggregatorOpts).exec();
    return count;
  }
});

/**
 * Statics
 */
CouponScheme.statics = {
  /**
   * Get coupon
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Coupon, APIError>}
   */
  get: function get(id) {
    return this.findById(id).exec().then(function (coupon) {
      if (coupon) {
        return coupon;
      }
      var err = new APIError('No such coupon exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },


  /**
   * List coupons in descending order of 'createdAt' timestamp.
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

    return this.find().select("-couponQR").sort({ createdAt: -1 }).skip(+skip).limit(+limit).exec();
  }
};

var Coupon = mongoose.model('Coupon', CouponScheme);
module.exports = { Coupon: Coupon };
//# sourceMappingURL=coupon.model.js.map
