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
 * Prize Schema
 */

var PrizeScheme = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  prize_image: {
    type: String
  },
  prize_type: {
    type: String,
    enum: ["meal", "multiplier", "merchandise"],
    default: "in-store"
  },
  total_quantity: {
    type: Number,
    default: 1,
    required: true
  },
  total_quantity_consumed: {
    type: Number,
    default: 0
  },
  total_points: {
    type: Number,
    default: 0,
    required: true
  },
  region: {
    type: String,
    enum: ["central", "northern", "western", "eastern", "southern"],
    default: "central",
    required: true
  },
  limit_per_day: {
    type: Number,
    default: 0,
    required: true
  },
  prize_value: {
    type: String,
    required: true
  },
  prize_status: {
    type: String,
    enum: ['active', 'in-active', 'completed'],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  days_consumption: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    prize_consume_date: {
      type: Date,
      default: Date.now
    },
    day_consume_status: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
      required: true
    }
  }]

});

/**
 * Methods
 */
PrizeScheme.method({

  //toJSON(){
  //  var user = this;
  //  var userObject = user.toObject();
  //  return _.pick(userObject, ['_id', 'email']);
  //},
  toJSON: function toJSON() {
    var coupon = this;
    var couponObject = coupon.toObject();
    //delete couponObject.couponQR;
    //return _.pick(userObject, ['_id', 'email']);
    return couponObject;
  }

  //generateQR(qrStatus, total_qr) {
  //  var coupon = this;
  //  for(var i=1;i<=total_qr;i++){
  //    coupon.couponQR.push({qr_id: new ObjectID(), qrStatus:qrStatus});
  //  }
  //  return coupon.save().then(() => {
  //    return coupon;
  //  });
  //},
  //
  //removeQR(qr_id) {
  //  var coupon = this;
  //
  //  return coupon.update(
  //    { $pull:{ couponQR:{qr_id} } },
  //    { multi: true }
  //  ).catch((e)=>{Promise.reject(e)});
  //},
  //
  //countQR() {
  //  var coupon = this;
  //  const aggregatorOpts = [
  //    {
  //      $unwind: "$couponQR"
  //    },
  //    {
  //      $group: {
  //        count: { $sum: 1 }
  //      }
  //    }
  //  ];
  //  var count = coupon.aggregate(aggregatorOpts).exec();
  //  return count;
  //}

});

/**
 * Statics
 */
PrizeScheme.statics = {
  /**
   * Get prize
   * @param {ObjectId} id - The objectId of prize.
   * @returns {Promise<Prize, APIError>}
   */
  get: function get(id) {
    return this.findById(id).exec().then(function (prize) {
      if (prize) {
        return prize;
      }
      var err = new APIError('No such prize exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },


  /**
   * List prizes in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of pirze to be skipped.
   * @param {number} limit - Limit number of prize to be returned.
   * @returns {Promise<Prize[]>}
   */
  list: function list() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$skip = _ref.skip,
        skip = _ref$skip === undefined ? 0 : _ref$skip,
        _ref$limit = _ref.limit,
        limit = _ref$limit === undefined ? 50 : _ref$limit;

    return this.find().select("-days_consumption").sort({ createdAt: -1 }).skip(+skip).limit(+limit).exec();
  }
};

var Prize = mongoose.model('Prize', PrizeScheme);
module.exports = { Prize: Prize };
//# sourceMappingURL=prize.model.js.map
