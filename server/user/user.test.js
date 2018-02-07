const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = require('expect');
const {ObjectID} = require("mongodb");
const {User} = require('./user.model');
const app = require('../../index');

chai.config.includeStack = true;

const {users, populateUsers, todos, populateTodos} = require('./../tests/seed/seed');

beforeEach(populateUsers);

beforeEach(populateTodos);

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## User APIs', () => {

  describe('# POST /api/users', ()=>{
    it('should create user',(done)=>{
      var name = "salman";
      var email = "email@email.com";
      var password = "passwordabc123";
      var mobileNumber = "0566458686";

      request(app)
        .post("/api/users")
        .send({name, email, password})
        .expect(httpStatus.OK)
        .expect((res)=>{
          expect(res.header).toHaveProperty('x-auth');
          expect(res.body).toHaveProperty('_id');
          expect(res.body.email).toBe(email);
        })
        .end((err)=>{
          if(err){
            return done(err);
          }

          User.findOne({email}).then((user)=>{
            expect(user).toBeTruthy();
            expect(user.email).toEqual(email);
            expect(user.password).not.toEqual(password);
            done();
          }).catch((e)=>{
            done(e);
          });

        });
    });

    it('should not create user with invalid data',(done)=>{
      request(app)
        .post("/api/users")
        .send({name:"salman", email:'sxample', password:'asd'})
        .expect(httpStatus.BAD_REQUEST)
        .end(done);
    });

    it('should not create user, if email already created',(done)=>{
      request(app)
        .post("/api/users")
        .send({name:"salman", email:users[0].email, password:'123465432125'})
        .expect(httpStatus.BAD_REQUEST)
        .end(done);
    });
  });


  describe('#GET /api/users/me', ()=>{
    it('should be valid user header', (done)=>{
      request(app)
        .get("/api/users/me")
        .set('x-auth', users[0].tokens[0].token)
        .expect(httpStatus.OK)
        .expect((res)=>{
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 for un-authorized user', (done)=>{
      request(app)
        .get("/api/users/me")
        .expect(httpStatus.UNAUTHORIZED)
        .expect((res)=>{
          expect(res.body).toEqual({});
        })
        .end(done);
    });

  });



  //let user = {
  //  username: 'KK123',
  //  mobileNumber: '1234567890'
  //};
  //
  //describe('# POST /api/users', () => {
  //  it('should create a new user', (done) => {
  //    request(app)
  //      .post('/api/users')
  //      .send(user)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body.username).to.equal(user.username);
  //        expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //        user = res.body;
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
  //
  //describe('# GET /api/users/:userId', () => {
  //  it('should get user details', (done) => {
  //    request(app)
  //      .get(`/api/users/${user._id}`)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body.username).to.equal(user.username);
  //        expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //        done();
  //      })
  //      .catch(done);
  //  });
  //
  //  it('should report error with message - Not found, when user does not exists', (done) => {
  //    request(app)
  //      .get('/api/users/56c787ccc67fc16ccc1a5e92')
  //      .expect(httpStatus.NOT_FOUND)
  //      .then((res) => {
  //        expect(res.body.message).to.equal('Not Found');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
  //
  //describe('# PUT /api/users/:userId', () => {
  //  it('should update user details', (done) => {
  //    user.username = 'KK';
  //    request(app)
  //      .put(`/api/users/${user._id}`)
  //      .send(user)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body.username).to.equal('KK');
  //        expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
  //
  //describe('# GET /api/users/', () => {
  //  it('should get all users', (done) => {
  //    request(app)
  //      .get('/api/users')
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body).to.be.an('array');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //
  //  it('should get all users (with limit and skip)', (done) => {
  //    request(app)
  //      .get('/api/users')
  //      .query({ limit: 10, skip: 1 })
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body).to.be.an('array');
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
  //
  //describe('# DELETE /api/users/', () => {
  //  it('should delete user', (done) => {
  //    request(app)
  //      .delete(`/api/users/${user._id}`)
  //      .expect(httpStatus.OK)
  //      .then((res) => {
  //        expect(res.body.username).to.equal('KK');
  //        expect(res.body.mobileNumber).to.equal(user.mobileNumber);
  //        done();
  //      })
  //      .catch(done);
  //  });
  //});
});
