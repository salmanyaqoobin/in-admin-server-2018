const async = require('async');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const validator = require('validator');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

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
  toJSON(){
    var coupon = this;
    var couponObject = coupon.toObject();
    //delete couponObject.couponQR;
    return couponObject;
    //return _.pick(userObject, ['_id', 'email']);
  },

  generateQR(qrStatus, total_qr) {
    var coupon = this;
    for(var i=1;i<=total_qr;i++){
      coupon.couponQR.push({qr_id: new ObjectID(), qrStatus:qrStatus});
    }
    return coupon.save().then(() => {
      return coupon;
    });
  },

  removeQR(qr_id) {
    var coupon = this;

    return coupon.update(
      { $pull:{ couponQR:{qr_id} } },
      { multi: true }
    ).catch((e)=>{Promise.reject(e)});
  },

  countQR() {
    var coupon = this;
    const aggregatorOpts = [
      {
        $unwind: "$couponQR"
      },
      {
        $group: {
          count: { $sum: 1 }
        }
      }
    ];
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
  get(id) {
    return this.findById(id)
      .exec()
      .then((coupon) => {
        if (coupon) {
          return coupon;
        }
        const err = new APIError('No such coupon exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List coupons in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .select("-couponQR")
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }


};

var Coupon = mongoose.model('Coupon', CouponScheme);
module.exports = {Coupon};


