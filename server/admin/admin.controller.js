const {Admin} = require('./admin.model.js');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Load admin and append to req.
 */
function load(req, res, next, id) {
  Admin.get(id)
    .then((admin) => {
      req.admin = admin; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get admin
 * @returns {Admin}
 */
function get(req, res) {
  return res.json(req.admin);
}

/**
 * Create new admin
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {

  try {
    const body = _.pick(req.body, ["name", 'email', 'password', 'role', 'is_active']);
    const admin = new Admin(body);

    await admin.save((err)=>{
      if (err && err.name === 'MongoError' && err.code === 11000) {
        const APIErr = new APIError('Email already exist!', httpStatus.BAD_REQUEST, true);
        next(APIErr);
        // Duplicate username
        //return res.status(500).send({ succes: false, message: 'User already exist!' });
      }
    });
    const token = await admin.generateAuthToken();
    res.header('x-auth', token).send(admin);
  } catch (e){

    //const err = new APIError('email already exist', httpStatus.BAD_REQUEST, true);
    //next(err);
    //res.status(httpStatus.BAD_REQUEST).send(err);
    e.message = "email already exist";
    next(e);
  }
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function update(req, res, next) {

  const id = req.body._id;
  const body = _.pick(req.body, ["name", 'email', 'role', 'is_active']);

  try {

    const admin = await Admin.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true}).catch((e)=>{
      const err = new APIError('Update Admin id not found error', httpStatus.NOT_FOUND, true);
      res.status(httpStatus.NOT_FOUND).send(err);
    });

    if(!admin){
      const err = new APIError('Update Admin id not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    res.send({admin});
  } catch (e){
    e.message = 'Update Admin error';
    next(e);
    //const err = new APIError('Update Admin error', httpStatus.BAD_REQUEST, true);
    //res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Admin.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete admin.
 * @returns {admin}
 */
function remove(req, res, next) {
  const admin = req.admin;
  admin.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

/**
 * Logout admin.
 */
async function logout(req, res) {
  try {
    await req.admin.removeToken(req.token);
    res.status(httpStatus.OK).send();
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Change admin password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

async function changePassword(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin._id).select("_id email password");
    const userHashedPassword = Admin.hash(req.body.password, admin.password);
    const changed = await Admin.changePassword(admin._id, req.body.password, req.body.newPassword, userHashedPassword);
    res.status(httpStatus.OK).send(changed);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }

  //User.changePassword(req.user._id, req.body.password, req.body.newPassword)
  //  .then(() => {
  //    res.json({ success: true });
  //  }).catch(next);
}


module.exports = { load, get, create, update, list, remove, changePassword, logout};
