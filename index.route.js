const express = require('express');
const path = require("path");

const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const todoRoutes = require('./server/todo/todo.route');
const adminRoutes = require('./server/admin/admin.route');
const couponRoutes = require('./server/coupon/coupon.route');
const prizeRoutes = require('./server/prize/prize.route');
const mediaRoutes = require('./server/media/media.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/admin', (req, res) => {
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
