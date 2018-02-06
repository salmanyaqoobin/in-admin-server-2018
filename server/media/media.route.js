'use strict';

var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../../config/param-validation');
var mediaCtrl = require('./media.controller');
//const {authenticate} = require('./../middleware/authenticate');

var _require = require('./../middleware/admin_authenticate'),
    admin_authenticate = _require.admin_authenticate;

var router = express.Router(); // eslint-disable-line new-cap

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

router.use(multiparty({ uploadDir: './uploads' }));

router.route('/')
/** GET /api/media - Get list of media */
.get(mediaCtrl.list)

/** POST /api/media - Create new media */
.post(admin_authenticate, multipartyMiddleware, mediaCtrl.create);

router.route('/:mediaId')

/** DELETE /api/media/:mediaId - Delete media */
.delete(admin_authenticate, mediaCtrl.remove);

router.param('mediaId', mediaCtrl.load);

module.exports = router;
//# sourceMappingURL=media.route.js.map
