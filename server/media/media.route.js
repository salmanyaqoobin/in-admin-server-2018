const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const mediaCtrl = require('./media.controller');
//const {authenticate} = require('./../middleware/authenticate');
const {admin_authenticate} = require('./../middleware/admin_authenticate');

const router = express.Router(); // eslint-disable-line new-cap

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

router.use(multiparty({ uploadDir: './uploads' }));

router.route('/')
  /** GET /api/media - Get list of media */
  .get( mediaCtrl.list)

  /** POST /api/media - Create new media */
  .post( admin_authenticate, multipartyMiddleware, mediaCtrl.create);

router.route('/:mediaId')

  /** DELETE /api/media/:mediaId - Delete media */
  .delete(admin_authenticate, mediaCtrl.remove);

router.param('mediaId', mediaCtrl.load);


module.exports = router;
