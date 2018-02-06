'use strict';

var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../../config/param-validation');
var userCtrl = require('./user.controller');

var _require = require('./../middleware/authenticate'),
    authenticate = _require.authenticate;

var _require2 = require('./../middleware/admin_authenticate'),
    admin_authenticate = _require2.admin_authenticate;

var router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/users - Get list of users */
.get(admin_authenticate, userCtrl.list)

/** POST /api/users - Create new user */
.post(validate(paramValidation.createUser), userCtrl.create);

router.route('/me').get(authenticate, function (req, res) {
  res.send(req.user);
});

router.route('/me/token').delete(authenticate, userCtrl.logout);

/**
 * POST /users/change-password
 * Change user password
 * */
router.route('/change-password').post(validate(paramValidation.passwordChange), authenticate, userCtrl.changePassword);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
.get(userCtrl.get)

/** PUT /api/users/:userId - Update user */
.put(validate(paramValidation.updateUser), authenticate, userCtrl.update)

/** PATCH /api/users/:userId - Update user */
.patch(validate(paramValidation.updateUser), admin_authenticate, userCtrl.update)

/** DELETE /api/users/:userId - Delete user */
.delete(admin_authenticate, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
//# sourceMappingURL=user.route.js.map
