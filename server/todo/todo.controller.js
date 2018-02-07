const {Todo} = require('./todo.model.js');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const {ObjectID} = require('mongodb');
/**
 * Load user and append to req.
 */
async function load(req, res, next, id) {

  if(!ObjectID.isValid(id)){
    return res.status(httpStatus.NOT_FOUND).send({error: "id is not valid"});
  }

  try {
    const todo= await Todo.findById(id);
    if(!todo){
      const err = new APIError('Todo not found', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    req.todo = todo; // eslint-disable-line no-param-reassign
    return next();
  } catch (e){
    next(e);
  }
}

/**
 * Get user
 * @returns {todos}
 */
function getTodo(req, res) {

  if(req.todo._creator.toHexString() !== req.user._id.toHexString()){
    const err = new APIError('Get Todos with unauthorized user error', httpStatus.NOT_FOUND, true);
    return res.status(httpStatus.NOT_FOUND).send(err);
  }
  return res.json({todo:req.todo});
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {

  try {
    const body = _.pick(req.body, ["title", 'text']);
    const todoData = new Todo(
      {
        title: body.title,
        text: body.text,
        completed: false,
        _creator: req.user._id
      }
    );
    const todo = await todoData.save();
    res.send(todo);

  } catch (e){
    const err = new APIError('Create Todos error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(err);
  }

}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function update(req, res, next) {
  const id = req.todo._id;
  const body = _.pick(req.body, ["title", "text", "completed"]);

  try {
    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = Date.now();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    const todo = await Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set: body}, {new: true}).catch((e)=>{
      const err = new APIError('Update Todos id not found error', httpStatus.NOT_FOUND, true);
      res.status(httpStatus.NOT_FOUND).send(err);
    });

    if(!todo){
      const err = new APIError('Update Todos id not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    res.send({todo});
  } catch (e){
    const err = new APIError('Update Todos error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  var { limit = 50, skip = 0 } = req.query;
  limit = parseInt(limit);
  skip = parseInt(skip);
  //Todo.list({ limit, skip })
  //  .then(todos => res.json(todos))
  //  .catch(e => next(e));

  Todo.find({_creator: req.user._id }, {}, {limit, skip})
    .then(todos => res.json(todos))
    .catch((e) => {
      res.status(400).send(e);
      //next(e);
    });
}

/**
 * Delete user.
 * @returns {User}
 */
async function remove(req, res, next) {
  const todo = req.todo;
  //todo.remove()
  //  .then(deletedUser => res.json(deletedUser))
  //  .catch(e => next(e));

  try {
    const todoRemove = await Todo.findOneAndRemove({
      _id: todo._id,
      _creator: req.user._id
    });
    if(!todoRemove){
      const err = new APIError('Delete Todos not found error', httpStatus.NOT_FOUND, true);
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    res.send({todo:todoRemove});
  } catch (e){
    const err = new APIError('Delete Todos error', httpStatus.BAD_REQUEST, true);
    res.status(httpStatus.BAD_REQUEST).send(err);
  }

}


module.exports = { load, getTodo, create, update, list, remove};
