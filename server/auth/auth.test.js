const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = require('expect');
const {ObjectID} = require("mongodb");
const {User} = require('./../user/user.model');
const app = require('../../index');
const config = require('../../config/config');

chai.config.includeStack = true;

const {users} = require('./../tests/seed/seed');
//beforeEach(populateUsers);

describe('## Auth APIs', () => {
  const validUserCredentials = {
    username: 'react',
    password: 'express'
  };

  const invalidUserCredentials = {
    username: 'react',
    password: 'IDontKnow'
  };

  let jwtToken;


  describe("#POST /api/auth/login", ()=>{

    it("should login user with valid credentials", (done)=>{

      request(app)
        .post("/api/auth/login")
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(httpStatus.OK)
        .expect((res)=>{
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res)=>{
          if(err){
            return done(err);
          }

          User.findById(users[1]._id).then((user)=>{
            expect(user.toObject().tokens[1]).toMatchObject({
              access: "auth",
              token: res.headers['x-auth']
            });
            //expect(user.tokens[0].access).toEqual("auth");
            //expect(user.tokens[0]._id).toEqual(user.tokens[0]._id);
            //expect(user.tokens[1].token).toEqual(res.headers['x-auth']);
            done();
          }).catch((e)=>{
            done(e);
          });
        });
    });

    it("should reject invalid login credentials", (done)=>{
      request(app)
        .post("/api/auth/login")
        .send({
          email: users[0].email,
          password: users[0].password+" 1"
        })
        .expect(httpStatus.BAD_REQUEST)
        .expect((res)=>{
          expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res)=>{
          if(err){
            return done(err);
          }

          User.findById(users[0]._id).then((user)=>{
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e)=>{
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
