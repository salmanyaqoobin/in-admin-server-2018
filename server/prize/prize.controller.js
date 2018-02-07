const {Prize} = require('./prize.model');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const {ObjectID} = require('mongodb');

/**
 * Load prize and append to req.
 */
async function load(req, res, next, id) {
  //Prize.get(id)
  //  .then((prize) => {
  //    req.prize = prize; // eslint-disable-line no-param-reassign
  //    return next();
  //  })
  //  .catch(e => next(e));

  if(!ObjectID.isValid(id)){
    return res.status(httpStatus.NOT_FOUND).send({message: "prize id is not valid"});
  }

  try {
    const prize= await Prize.findById(id);
    if(!prize){
      const err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send({message: "Coupon not found"});
    }
    req.prize = prize; // eslint-disable-line no-param-reassign
    return next();
  } catch (e){
    next(e);
  }

}

/**
 * Get prize
 * @returns {Prize}
 */
function get(req, res) {
  return res.json(req.prize);
}

/**
 * Get prize list.
 * @property {number} req.query.skip - Number of prizes to be skipped.
 * @property {number} req.query.limit - Limit number of prizes to be returned.
 * @returns {Prize[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Prize.list({ limit, skip })
    .then(prize => res.json(prize))
    .catch(e => next(e));
}

/**
 * Create new prize
 * @property {string} req.body.title - The title of prize.
 * @property {string} req.body.prize_image - The prize_image of prize.
 * @property {string} req.body.prize_type - The prize_type of prize.
 * @property {number} req.body.total_quantity - The total_quantity of prize.
 * @property {number} req.body.total_points - The total_points of prize.
 * @property {string} req.body.region - The region of prize.
 * @property {string} req.body.limit_per_day - The limit_per_day of prize.
 * @property {string} req.body.prize_value - The prize_value of prize.
 * @property {string} req.body.prize_status - The prize_status of prize.
 *
 * @returns {Prize}
 */
async function create(req, res, next) {

  try {
    const body = _.pick(req.body, ["title", 'prize_image', 'prize_type', 'total_quantity',
      "total_points", "region", "limit_per_day", "prize_value", "prize_status"]);
    const prize = new Prize(body);

    await prize.save();
    res.send(prize);
  } catch (e){
    const err = new APIError('Create Prize error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(err);
    //next(e);
  }

}

/**
 * Update new prize
 * @property {string} req.body.title - The title of prize.
 * @property {string} req.body.prize_image - The prize_image of prize.
 * @property {string} req.body.prize_type - The prize_type of prize.
 * @property {number} req.body.total_quantity - The total_quantity of prize.
 * @property {number} req.body.total_points - The total_points of prize.
 * @property {string} req.body.region - The region of prize.
 * @property {string} req.body.limit_per_day - The limit_per_day of prize.
 * @property {string} req.body.prize_value - The prize_value of prize.
 * @property {string} req.body.prize_status - The prize_status of prize.
 *
 * @returns {Prize}
 */
async function update(req, res, next) {
  const id = req.prize._id;
  const body = _.pick(req.body, ["title", 'prize_image', 'prize_type', 'total_quantity',
    "total_points", "region", "limit_per_day", "prize_value", "prize_status"]);

  try {

    const prize = await Prize.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true}).catch((e)=>{
      const err = new APIError('Update prize id not found error', httpStatus.NOT_FOUND, true);
      res.status(httpStatus.NOT_FOUND).send(err);
    });

    if(!prize){
      const err = new APIError('Update prize id not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    res.send({prize});
  } catch (e){
    const err = new APIError('Update prize error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Delete prize.
 * @returns {Prize}
 */
function remove(req, res, next) {
  const prize = req.prize;
  prize.remove()
    .then(deletedPrize => res.json(deletedPrize))
    .catch(e => next(e));
}

module.exports = { load, get, list, create, update, remove};
