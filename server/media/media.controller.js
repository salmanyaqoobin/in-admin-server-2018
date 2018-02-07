const {Media} = require('./media.model');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const {ObjectID} = require('mongodb');
const multer = require('multer');

const DIR = './uploads/';
const upload = multer({dest: DIR}).single('photo');
/**
 * Load media and append to req.
 */
async function load(req, res, next, id) {
  //Media.get(id)
  //  .then((media) => {
  //    req.media = media; // eslint-disable-line no-param-reassign
  //    return next();
  //  })
  //  .catch(e => next(e));
  //
  if(!ObjectID.isValid(id)){
    return res.status(httpStatus.NOT_FOUND).send({message: "media id is not valid"});
  }

  try {
    const media= await Media.findById(id);
    if(!media){
      const err = new APIError('Coupon not found', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send({message: "media not found"});
    }
    req.media = media; // eslint-disable-line no-param-reassign
    return next();
  } catch (e){
    next(e);
  }
}

/**
 * Get media
 * @returns {Media}
 */
function get(req, res) {
  return res.json(req.media);
}

/**
 * Get media list.
 * @property {number} req.query.skip - Number of coupons to be skipped.
 * @property {number} req.query.limit - Limit number of coupons to be returned.
 * @returns {Media[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Media.list({ limit, skip })
    .then(media => res.json(media))
    .catch(e => next(e));
}

/**
 * Create new media
 * @property {string} req.body.originalFilename - The originalFilename of media.
 * @property {string} req.body.src - The src of media.
 * @property {string} req.body.path - The path of media.
 * @property {string} req.body.size - The size of media.
 *
 * @property {string} req.body.type - The type of media.
 * @property {string} req.body.name - The name of media.
 * @property {string} req.body.uid - The uid of media.
 * @property {string} req.body.uname - The uname of media.
 * @property {string} req.body.uemail - The uemail of media.
 * @property {string} req.body.active - The active of media.
 *
 * @returns {Media}
 */
async function create(req, res, next) {

  //var path = '';
  //uploadImage = await upload(req, res, function (err) {
  //  if (err) {
  //    // An error occurred when uploading
  //    console.log(err);
  //    return res.status(422).send("an Error occured")
  //  }
  //  // No error occured.
  //  return req.files.photo;
  //});
  try {
    req.body = req.files.photo;
    const body = _.pick(req.body, [ "originalFilename", 'src', 'path', 'size', "type", "name", "uid", "uname", "uemail", "active"]);
    const media = new Media(body);

    await media.save();
    res.send(media);
  } catch (e){
    //e.message = 'Create Media error';
    //next(e);
    const err = new APIError('Create Media error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send({message:"Media upload error."});
    //next(e);
  }

}

/**
 * Delete media.
 * @returns {Media}
 */
function remove(req, res, next) {
  const media = req.media;
  media.remove()
    .then(deletedMedia => res.json(deletedMedia))
    .catch(e => next(e));
}

module.exports = { load, get, list, create, remove};
