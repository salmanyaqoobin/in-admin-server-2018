'use strict';

var Joi = require('joi');
var validator = require('validator');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().required(),
      //mobileNumber: Joi.string().regex(/^[0-9][0-9]{9}$/).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required()
    }
  },

  // POST /api/todos
  createTodo: {
    body: {
      title: Joi.string().required(),
      text: Joi.string().required()
    }
  },

  // UPDATE /api/todos/:todoId
  updateTodo: {
    body: {
      title: Joi.string().required(),
      text: Joi.string().required()
    },
    headers: {
      'x-auth': Joi.string().required()
    }
  },

  // PUT /api/users/change-password
  passwordChange: {
    body: {
      password: Joi.string().min(8).max(64).required(),
      newPassword: Joi.string().min(8).max(64).required()
    }
  },

  // POST /api/admins
  createAdmin: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(64).required(),
      role: Joi.string().required()
    }
  },

  // UPDATE /api/admins/:adminId
  updateAdmin: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string().required()
    },
    params: {
      adminId: Joi.string().hex().required()
    }
  },

  // PUT /api/admins/change-password
  adminPasswordChange: {
    body: {
      password: Joi.string().min(8).max(64).required(),
      newPassword: Joi.string().min(8).max(64).required()
    }
  },

  // GET /api/admins/
  adminList: {
    headers: {
      'x-auth': Joi.string().required()
    }
  },

  // POST /api/coupons
  createCoupon: {
    body: {
      title: Joi.string().required(),
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
      total_coupon_limit: Joi.number().required()
    }
  },

  // UPDATE /api/coupons/:couponId
  updateCoupon: {
    body: {
      title: Joi.string().required(),
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
      total_coupon_limit: Joi.number().required()
    },
    params: {
      couponId: Joi.string().hex().required()
    }
  },

  // POST /api/coupons/:couponId/qr
  createCouponQR: {
    body: {
      qrStatus: Joi.number().required(),
      total_qr: Joi.number().required()
    }
  },

  // POST /api/prizes
  createPrize: {
    body: {
      title: Joi.string().required(),
      prize_type: Joi.string().required(),
      total_quantity: Joi.number().required(),
      total_points: Joi.number().required(),
      region: Joi.string().required(),
      limit_per_day: Joi.number().required(),
      prize_value: Joi.string().required()
    }
  },

  // PUT /api/prizes/:prizeId
  updatePrize: {
    body: {
      title: Joi.string().required(),
      prize_type: Joi.string().required(),
      total_quantity: Joi.number().required(),
      total_points: Joi.number().required(),
      region: Joi.string().required(),
      limit_per_day: Joi.number().required(),
      prize_value: Joi.string().required()
    },
    params: {
      prizeId: Joi.string().hex().required()
    }
  }

};
//# sourceMappingURL=param-validation.js.map
