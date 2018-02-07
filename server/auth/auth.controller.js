const {User} = require('./../user/user.model');
const {Admin} = require('./../admin/admin.model');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {

  const body = _.pick(req.body, [ 'email', 'password']);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).status(httpStatus.OK).send(user);
  } catch (e){
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    res.status(httpStatus.BAD_REQUEST).send(e);
    //next(e);
  }
}


/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function adminLogin(req, res, next) {

  const body = _.pick(req.body, [ 'email', 'password']);

  try {
    const admin = await Admin.findByCredentials(body.email, body.password);
    const token = await admin.generateAuthToken();
    res.header('x-auth', token).status(httpStatus.OK).send(admin);
  } catch (e){
    //const err = new APIError('Authentication error', httpStatus.BAD_REQUEST, true);
    //const resError = {"errors":{"email or password":["invalid"]}};
    //res.status(httpStatus.BAD_REQUEST).send(resError);
    e.message = "email or password invalid";
    next(e);
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber, adminLogin };
