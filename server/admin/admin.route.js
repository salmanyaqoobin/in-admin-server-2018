const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const adminCtrl = require('./admin.controller.js');
const {admin_authenticate} = require('./../middleware/admin_authenticate');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/admins - Get list of admins */
  .get(validate(paramValidation.adminList), admin_authenticate, adminCtrl.list)

  /** POST /api/admins - Create new admin */
  .post(validate(paramValidation.createAdmin),  adminCtrl.create);

router.route('/me')
  .get(admin_authenticate, (req, res)=>{
    res.send(req.admin);
  });

router.route('/me/token')
  .delete( admin_authenticate, adminCtrl.logout);

/**
 * POST /admins/change-password
 * Change user password
 * */
router.route('/change-password')
  .post( validate(paramValidation.adminPasswordChange), admin_authenticate, adminCtrl.changePassword);


router.route('/:adminId')
  /** GET /api/admins/:adminId - Get admin */
  .get(adminCtrl.get)

  /** PUT /api/admins/:adminId - Update user */
  .put(validate(paramValidation.updateAdmin), admin_authenticate, adminCtrl.update)

  /** DELETE /api/admins/:userId - Delete user */
  .delete(admin_authenticate, adminCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('adminId', adminCtrl.load);

module.exports = router;
