/**
 * Created by Salman on 12/16/2017.
 */

var {Admin} = require('./../admin/admin.model');

var admin_authenticate = (req, res, next)=>{
    var token = req.header('x-auth');

    Admin.findByToken(token).then((admin)=>{
        if(!admin){
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send();
    });
};

module.exports = {admin_authenticate};

