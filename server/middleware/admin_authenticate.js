'use strict';

/**
 * Created by Salman on 12/16/2017.
 */

var _require = require('./../admin/admin.model'),
    Admin = _require.Admin;

var admin_authenticate = function admin_authenticate(req, res, next) {
    var token = req.header('x-auth');

    Admin.findByToken(token).then(function (admin) {
        if (!admin) {
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch(function (e) {
        res.status(401).send();
    });
};

module.exports = { admin_authenticate: admin_authenticate };
//# sourceMappingURL=admin_authenticate.js.map
