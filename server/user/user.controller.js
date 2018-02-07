const {User} = require('./user.model');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {

  try {
    const body = _.pick(req.body, ["name", 'email', 'password', 'mobileNumber']);
    const user = new User(body);

    await user.save((err)=>{
      if (err && err.name === 'MongoError' && err.code === 11000) {
        const APIErr = new APIError('Email already exist!', httpStatus.BAD_REQUEST, true);
        next(APIErr);
        // Duplicate username
        //return res.status(500).send({ succes: false, message: 'User already exist!' });
      }
    });
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e){
    e.message = "email already exist";
    //const err = new APIError('Signup error', httpStatus.BAD_REQUEST, true);
    //res.status(httpStatus.BAD_REQUEST).send(err);
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
  const body = _.pick(req.body, ["name", 'mobileNumber', 'is_active']);

  try {

    const user = await User.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true}).catch((e)=>{
      const err = new APIError('Update User id not found error', httpStatus.NOT_FOUND, true);
      res.status(httpStatus.NOT_FOUND).send(err);
    });

    if(!user){
      const err = new APIError('Update User id not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    res.send({user});
  } catch (e){
    e.message = 'Update User error';
    next(e);
    //const err = new APIError('Update User error', httpStatus.BAD_REQUEST, true);
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
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

/**
 * Logout user.
 */
async function logout(req, res) {
  try {
    await req.user.removeToken(req.token);
    res.status(httpStatus.OK).send();
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Change user password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

async function changePassword(req, res, next) {
  try {
    const user  = await User.findById(req.user._id).select("_id email password");
    const userHashedPassword = User.hash(req.body.password, user.password);
    const changed = await User.changePassword(user._id, req.body.password, req.body.newPassword, userHashedPassword);
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
