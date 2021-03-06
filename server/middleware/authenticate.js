/**
 * Created by Salman on 12/16/2017.
 */

var {User} = require('./../user/user.model');

var authenticate = (req, res, next)=>{
    var token = req.header('x-auth');

    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send({message:"Unauthorized user, login again"});
    });
};

module.exports = {authenticate};

