'use strict';

var express = require('express');
var path = require("path");

var userRoutes = require('./server/user/user.route');
var authRoutes = require('./server/auth/auth.route');
var todoRoutes = require('./server/todo/todo.route');
var adminRoutes = require('./server/admin/admin.route');
var couponRoutes = require('./server/coupon/coupon.route');
var prizeRoutes = require('./server/prize/prize.route');
var mediaRoutes = require('./server/media/media.route');

var router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount admins routes at /admins
router.use('/admins', adminRoutes);

// mount coupon routes at /coupons
router.use('/coupons', couponRoutes);

// mount prize routes at /prizes
router.use('/prizes', prizeRoutes);

// mount media routes at /media
router.use('/media', mediaRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount todos routes at /todos
router.use('/todos', todoRoutes);

module.exports = router;
//# sourceMappingURL=index.route.js.map
