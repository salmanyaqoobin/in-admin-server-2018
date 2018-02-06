'use strict';

var request = require('supertest-as-promised');
var httpStatus = require('http-status');
var jwt = require('jsonwebtoken');
var chai = require('chai'); // eslint-disable-line import/newline-after-import
var expect = require('expect');

var _require = require("mongodb"),
    ObjectID = _require.ObjectID;

var _require2 = require('./../user/user.model'),
    User = _require2.User;

var app = require('../../index');
var config = require('../../config/config');

chai.config.includeStack = true;

var _require3 = require('./../tests/seed/seed'),
    users = _require3.users;
//beforeEach(populateUsers);

describe('## Auth APIs', function () {
  var validUserCredentials = {
    username: 'react',
    password: 'express'
  };

  var invalidUserCredentials = {
    username: 'react',
    password: 'IDontKnow'
  };

  var jwtToken = void 0;

  describe("#POST /api/auth/login", function () {

    it("should login user with valid credentials", function (done) {

      request(app).post("/api/auth/login").send({
        email: users[1].email,
        password: users[1].password
      }).expect(httpStatus.OK).expect(function (res) {
        expect(res.headers['x-auth']).toBeTruthy();
      }).end(function (err, res) {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then(function (user) {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: "auth",
            token: res.headers['x-auth']
          });
          //expect(user.tokens[0].access).toEqual("auth");
          //expect(user.tokens[0]._id).toEqual(user.tokens[0]._id);
          //expect(user.tokens[1].token).toEqual(res.headers['x-auth']);
          done();
        }).catch(function (e) {
          done(e);
        });
      });
    });

    it("should reject invalid login credentials", function (done) {
      request(app).post("/api/auth/login").send({
        email: users[0].email,
        password: users[0].password + " 1"
      }).expect(httpStatus.BAD_REQUEST).expect(function (res) {
        expect(res.headers['x-auth']).toBeFalsy();
      }).end(function (err, res) {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then(function (user) {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(function (e) {
          done(e);
        });
      });
    });
  });

  //
  //
  //describe('# POST /api/auth/login', () => {
  //  it('should return Authentication error', (done) => {
  //    request(app)
  //      .post('/api/auth/login')
  //      .send(invalidUserCredentials)
  //      .expect(httpStatus.UNAUTHORIZED)
  //      .then((res) => {
  //        expect(res.body.message).to.equal('Authentication error');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //
  //  it('should get valid JWT token', (done) => {
  //    request(app)
  //      .post('/api/auth/login')
  //      .send(validUserCredentials)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body).to.have.property('token');
  //        jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
  //          expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
  //          expect(decoded.username).to.equal(validUserCredentials.username);
  //          jwtToken = `Bearer ${res.body.token}`;
  //          done();
  //        });
  //      })
  //      .catch(done);
  //  });
  //});
  //
  //describe('# GET /api/auth/random-number', () => {
  //  it('should fail to get random number because of missing Authorization', (done) => {
  //    request(app)
  //      .get('/api/auth/random-number')
  //      .expect(httpStatus.UNAUTHORIZED)
  //      .then((res) => {
  //        expect(res.body.message).to.equal('Unauthorized');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //
  //  it('should fail to get random number because of wrong token', (done) => {
  //    request(app)
  //      .get('/api/auth/random-number')
  //      .set('Authorization', 'Bearer inValidToken')
  //      .expect(httpStatus.UNAUTHORIZED)
  //      .then((res) => {
  //        expect(res.body.message).to.equal('Unauthorized');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //
  //  it('should get a random number', (done) => {
  //    request(app)
  //      .get('/api/auth/random-number')
  //      .set('Authorization', jwtToken)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body.num).to.be.a('number');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
});
//# sourceMappingURL=auth.test.js.map
