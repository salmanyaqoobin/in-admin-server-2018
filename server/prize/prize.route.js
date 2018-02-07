const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const prizeCtrl = require('./prize.controller');
const {authenticate} = require('./../middleware/authenticate');
const {admin_authenticate} = require('./../middleware/admin_authenticate');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/prizes - Get list of prizes */
  .get(admin_authenticate, prizeCtrl.list)

  /** POST /api/prizes - Create new prize */
  .post(admin_authenticate, validate(paramValidation.createPrize),  prizeCtrl.create);

router.route('/:prizeId')
  /** GET /api/prizes/:prizeId - Get prize */
  .get(admin_authenticate, prizeCtrl.get)

  /** PUT /api/prizes/:prizeId - Update prize */
  .put(validate(paramValidation.updatePrize), admin_authenticate, prizeCtrl.update)

  /** DELETE /api/prizes/:prizeId - Delete prize */
  .delete(admin_authenticate, prizeCtrl.remove);

router.param('prizeId', prizeCtrl.load);

module.exports = router;
