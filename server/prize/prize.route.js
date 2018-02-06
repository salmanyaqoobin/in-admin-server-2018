'use strict';

var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../../config/param-validation');
var prizeCtrl = require('./prize.controller');

var _require = require('./../middleware/authenticate'),
    authenticate = _require.authenticate;

var _require2 = require('./../middleware/admin_authenticate'),
    admin_authenticate = _require2.admin_authenticate;

var router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/prizes - Get list of prizes */
.get(admin_authenticate, prizeCtrl.list)

/** POST /api/prizes - Create new prize */
.post(admin_authenticate, validate(paramValidation.createPrize), prizeCtrl.create);

router.route('/:prizeId')
/** GET /api/prizes/:prizeId - Get prize */
.get(admin_authenticate, prizeCtrl.get)

/** PUT /api/prizes/:prizeId - Update prize */
.put(validate(paramValidation.updatePrize), admin_authenticate, prizeCtrl.update)

/** DELETE /api/prizes/:prizeId - Delete prize */
.delete(admin_authenticate, prizeCtrl.remove);

router.param('prizeId', prizeCtrl.load);

module.exports = router;
//# sourceMappingURL=prize.route.js.map
