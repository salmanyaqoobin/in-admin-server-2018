const {Coupon} = require('./coupon.model');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const {ObjectID} = require('mongodb');
/**
 * Load coupon and append to req.
 */
async function load(req, res, next, id) {
  //Coupon.get(id)
  //  .then((coupon) => {
  //    req.coupon = coupon; // eslint-disable-line no-param-reassign
  //    return next();
  //  })
  //  .catch(e => next(e));
  //
  if(!ObjectID.isValid(id)){
    return res.status(httpStatus.NOT_FOUND).send({message: "coupon id is not valid"});
  }

  try {
    const coupon= await Coupon.findById(id);
    if(!coupon){
      const err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send({message: "Coupon not found"});
    }
    req.coupon = coupon; // eslint-disable-line no-param-reassign
    return next();
  } catch (e){
    next(e);
  }
}

/**
 * Get coupon
 * @returns {Coupon}
 */
function get(req, res) {
  return res.json(req.coupon);
}

/**
 * Get coupon list.
 * @property {number} req.query.skip - Number of coupons to be skipped.
 * @property {number} req.query.limit - Limit number of coupons to be returned.
 * @returns {Coupon[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Coupon.list({ limit, skip })
    .then(coupon => res.json(coupon))
    .catch(e => next(e));
}


/**
 * Create new coupon
 * @property {string} req.body.title - The title of coupon.
 * @property {string} req.body.start_date - The start_date of coupon.
 * @property {string} req.body.end_date - The end_date of coupon.
 * @property {string} req.body.total_coupon_limit - The total_coupon_limit of coupon.
 * @returns {Coupon}
 */
async function create(req, res, next) {

  try {
    const body = _.pick(req.body, ["title", 'start_date', 'end_date', 'coupon_type',
      "total_coupon_limit", "total_coupon_consumed", "region", "createdAt", "qr_status"]);
    const coupon = new Coupon(body);

    await coupon.save();
    res.send({coupon});
  } catch (e){
    const err = new APIError('Create Coupon error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(err);
    //next(e);
  }

}


/**
 * Create new coupon
 * @property {string} req.body.title - The title of coupon.
 * @property {string} req.body.start_date - The start_date of coupon.
 * @property {string} req.body.end_date - The end_date of coupon.
 * @property {string} req.body.total_coupon_limit - The total_coupon_limit of coupon.
 * @returns {Coupon}
 */
async function update(req, res, next) {
  const id = req.coupon._id;
  const body = _.pick(req.body, ["title", 'start_date', 'end_date', 'coupon_type',
    "total_coupon_limit", "region", "qr_status"]);

  try {

    const coupon = await Coupon.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true}).catch((e)=>{
      const err = new APIError('Update coupon id not found error', httpStatus.NOT_FOUND, true);
      res.status(httpStatus.NOT_FOUND).send(err);
    });

    if(!coupon){
      const err = new APIError('Update coupon id not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send({message: "Update coupon id not found error"});
    }
    res.send({coupon});
  } catch (e){
    const err = new APIError('Update coupon error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}


/**
 * Delete coupon.
 * @returns {Coupon}
 */
function remove(req, res, next) {
  const coupon = req.coupon;
  coupon.remove()
    .then(deletedCoupon => res.json(deletedCoupon))
    .catch(e => next(e));
}


/**
 * Get qr
 * @returns {Coupon}
 */
async function getQR(req, res) {
  const coupon = req.coupon;
  try{
    const couponQR = await Coupon.findById(coupon._id).select("couponQR").catch((e)=>{
      res.status(httpStatus.NOT_FOUND).send(e);
    });
    //couponQR
    return res.json(couponQR);
  } catch (e){
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Get qr Count
 * @returns {Coupon}
 */
async function getQRCount(req, res, next) {
  const coupon = req.coupon;
  try{
    const couponCount = coupon.couponQR.length;

    return res.json(couponCount);
  } catch (e){
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}



/**
 * Create new coupon QR
 * @property {number} req.body.qrStatus - The qrStatus of QR.
 * @property {number} req.body.total_qr - The total_qr of QR.
 * @returns {User}
 */
async function createQR(req, res, next) {

  try {
    const body = _.pick(req.body, ["qrStatus", 'total_qr']);
    const coupon = req.coupon;
    const couponCount = coupon.couponQR.length;
    if(coupon.total_coupon_limit >= (body.total_qr + couponCount)){
      const couponQR = await coupon.generateQR(body.qrStatus, body.total_qr).catch((e)=>{
        res.status(httpStatus.NOT_FOUND).send(e);
      });
      res.send(couponQR);
    } else {
      const err = new APIError('requested QR limit is exceeding with total QR limit try again', httpStatus.BAD_REQUEST, true);
      res.status(httpStatus.BAD_REQUEST).send({message:'requested QR limit is exceeding with total QR limit try again'});
    }

  } catch (e){
    e.message = "Create Coupon QR error";
    next(e);
    //const err = new APIError('Create Coupon error', httpStatus.BAD_REQUEST, true);
    //res.status(httpStatus.BAD_REQUEST).send(err);
  }

}



/**
 * Delete coupon.
 * @returns {Coupon}
 */
async function removeQR(req, res, next) {
  const coupon = req.coupon;
  const couponQRID = req.params.couponQRID;
  console.log("couponQRID",couponQRID);
  console.log("_id",coupon._id);
  try{
    const qr_remove = await coupon.removeQR(couponQRID);
    res.send(qr_remove);
  } catch (e){
    const resError = {"errors":{"some problem deleting QR code":[" try again"]}};
    res.status(httpStatus.BAD_REQUEST).send(resError);
  }
}




module.exports = { load, get, list, create, update, remove, getQR, createQR, getQRCount, removeQR};
