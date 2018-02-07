/**
 * Created by Salman on 12/16/2017.
 */
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../todo/todo.model');
const {User} = require('./../../user/user.model');

const jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

const users = [
    {
        _id: userOneID,
        name: 'Salman 1',
        email: 'sy1@in-hq.com',
        password:"passwordUser1",
        mobileNumber:"1234567890",
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneID, access:'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoID,
        name: 'Salman 2',
        email: 'sy2@in-hq.com',
        password:"passwordUser2",
        mobileNumber:"1234567890",
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userTwoID, access:'auth'}, process.env.JWT_SECRET).toString()
        }]
    }
];

const todos = [
    {
        _id: new ObjectID(),
        title: 'First test todo',
        text: 'First test todo',
        _creator: userOneID
    },
    {
        _id: new ObjectID(),
        title: 'Second test todo',
        text: 'Second test todo',
        completed: true,
        completedAt: Date.now(),
        _creator: userTwoID
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done());
};

var populateUsers = (done)=>{
    User.remove({}).then(()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
        //return User.insertMany(users);
    }).then(()=>done());
};

//todos, populateTodos,
module.exports = { users, populateUsers, todos, populateTodos};
