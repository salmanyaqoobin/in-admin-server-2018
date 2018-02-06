'use strict';

var mongoose = require('mongoose');
var request = require('supertest');
var httpStatus = require('http-status');
var chai = require('chai'); // eslint-disable-line import/newline-after-import
var expect = require('expect');

var _require = require("mongodb"),
    ObjectID = _require.ObjectID;

var _require2 = require('./../user/user.model.js'),
    User = _require2.User;

var _require3 = require('./todo.model.js'),
    Todo = _require3.Todo;

var app = require('../../index');

chai.config.includeStack = true;

var _require4 = require('./../tests/seed/seed'),
    todos = _require4.todos,
    users = _require4.users;

describe('## Todos APIs', function () {

  describe('#POST /api/todos', function () {

    it('should create new todos', function (done) {
      var title = "First title";
      var text = "Test todo text";

      request(app).post("/api/todos").set("x-auth", users[0].tokens[0].token).send({ title: title, text: text }).expect(200).expect(function (res) {
        expect(res.body.text).toBe(text);
      }).end(function (err, res) {
        if (err) {
          done(err);
        }

        Todo.find({ text: text }).then(function (todo) {
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(text);
          done();
        }).catch(function (e) {
          done(e);
        });
      });
    });

    it('should not create new todos', function (done) {
      var title = "First title";
      var text = "Test todo text";

      request(app).post("/api/todos").set("x-auth", users[0].tokens[0].token).send({}).expect(400).end(function (err, res) {
        if (err) {
          done(err);
        }
        Todo.find().then(function (todo) {
          expect(todo.length).toBe(2);
          done();
        }).catch(function (e) {
          done(e);
        });
      });
    });
  });

  describe('#GET /api/todos', function () {

    it('Get all todos list', function (done) {

      request(app).get('/api/todos').set("x-auth", users[0].tokens[0].token).send({}).expect(200).expect(function (res) {
        expect(res.body.length).toBe(1);
      }).end(done);
    });
  });

  describe("#GET /api/todos/:todoId", function () {
    it("should get todo by id", function (done) {
      request(app).get('/api/todos/' + todos[0]._id.toHexString()).set("x-auth", users[0].tokens[0].token).expect(200).expect(function (res) {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
    });

    it("should not return todo created by another user", function (done) {
      request(app).get('/api/todos/' + todos[1]._id.toHexString()).set("x-auth", users[0].tokens[0].token).expect(404).expect(function (res) {
        expect(res.body.name).toBe("APIError");
      }).end(done);
    });

    it("sholud get 404 if todo is not found", function (done) {
      var newObjectID = new ObjectID();
      request(app).get('/api/todos/' + newObjectID.toHexString()).set("x-auth", users[0].tokens[0].token).expect(404).end(done);
    });

    it("sholud get 404 for non-object ID", function (done) {
      var id = "123124swasd123";
      request(app).get('/api/todos/' + id).set("x-auth", users[0].tokens[0].token).expect(404).end(done);
    });
  });

  describe("#DELETE /api/todos/:id", function () {

    it("should delete a todo", function (done) {
      var newObjextID = todos[0]._id.toHexString();
      request(app).delete('/api/todos/' + newObjextID).set("x-auth", users[0].tokens[0].token).expect(200).expect(function (res) {
        expect(res.body.todo._id).toBe(newObjextID);
      }).end(function (err, res) {
        if (err) {
          return done(err);
        }
        Todo.findById(newObjextID).then(function (todo) {
          if (!todo) {
            expect(todo).toBeFalsy();
            done();
          }
        }).catch(function (e) {
          done(e);
        });
      });
    });

    it("should not delete a todo created by another user", function (done) {
      var newObjextID = todos[1]._id.toHexString();
      request(app).delete('/api/todos/' + newObjextID).set("x-auth", users[0].tokens[0].token).expect(404).end(function (err, res) {
        if (err) {
          return done(err);
        }

        Todo.findById(newObjextID).then(function (todo) {
          expect(todo).toBeTruthy();
          done();
        }).catch(function (e) {
          done(e);
        });
      });
    });

    it("should return 404 with id not found", function (done) {
      var newObjextID = new ObjectID().toHexString();
      request(app).delete('/api/todos/' + newObjextID).set("x-auth", users[0].tokens[0].token).expect(404).end(done);
    });

    it("should return 404 with invalid id", function (done) {
      request(app).delete('/api/todos/12345122').set("x-auth", users[0].tokens[0].token).expect(404).end(done);
    });
  });

  describe("PATCH /api/todo/:id", function () {

    it("should update todo", function (done) {
      var newObjectID = todos[0]._id.toHexString();
      var body = { completed: true, text: "updated text hehehhe", title: "updated text hehehhe" };

      try {
        request(app).patch('/api/todos/' + newObjectID).set("x-auth", users[0].tokens[0].token).send(body).expect(200).expect(function (res) {
          expect(res.body.todo.text).toBe(body.text);
          expect(res.body.todo.completed).toBeTruthy();
        }).end(done);
      } catch (e) {
        return done(e);
      }
    });

    it("should not update todo for another user", function (done) {
      var newObjectID = todos[1]._id.toHexString();
      var body = { completed: true, text: "updated text hehehhe", title: "updated text hehehhe" };

      try {
        request(app).patch('/api/todos/' + newObjectID).set("x-auth", users[0].tokens[0].token).send(body).expect(404).expect(function (res) {
          expect(res.body.name).toBe("APIError");
        }).end(done);
      } catch (e) {
        return done(e);
      }
    });

    it("should clear completedAt when todo is not completed", function (done) {
      var newObjectID = todos[1]._id.toHexString();
      var body = { completed: false, text: "updated text hehehhe", title: "updated text hehehhe" };
      request(app).patch('/api/todos/' + newObjectID).set("x-auth", users[1].tokens[0].token).send(body).expect(200).expect(function (res) {
        expect(res.body.todo.completed).toBeFalsy();
        expect(res.body.todo.completedAt).toBeNull();
      }).end(done);
    });
  });
});
//# sourceMappingURL=todo.test.js.map
