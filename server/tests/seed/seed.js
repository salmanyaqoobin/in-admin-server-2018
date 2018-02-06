'use strict';

/**
 * Created by Salman on 12/16/2017.
 */
var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var _require2 = require('./../../todo/todo.model'),
    Todo = _require2.Todo;

var _require3 = require('./../../user/user.model'),
    User = _require3.User;

var jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

var users = [{
    _id: userOneID,
    name: 'Salman 1',
    email: 'sy1@in-hq.com',
    password: "passwordUser1",
    mobileNumber: "1234567890",
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneID, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoID,
    name: 'Salman 2',
    email: 'sy2@in-hq.com',
    password: "passwordUser2",
    mobileNumber: "1234567890",
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoID, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

var todos = [{
    _id: new ObjectID(),
    title: 'First test todo',
    text: 'First test todo',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    title: 'Second test todo',
    text: 'Second test todo',
    completed: true,
    completedAt: Date.now(),
    _creator: userTwoID
}];

var populateTodos = function populateTodos(done) {
    Todo.remove({}).then(function () {
        return Todo.insertMany(todos);
    }).then(function () {
        return done();
    });
};

var populateUsers = function populateUsers(done) {
    User.remove({}).then(function () {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
        //return User.insertMany(users);
    }).then(function () {
        return done();
    });
};

//todos, populateTodos,
module.exports = { users: users, populateUsers: populateUsers, todos: todos, populateTodos: populateTodos };
//# sourceMappingURL=seed.js.map
