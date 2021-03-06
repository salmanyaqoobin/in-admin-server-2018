const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = require('expect');
const {ObjectID} = require("mongodb");
const {User} = require('./../user/user.model.js');
const {Todo} = require('./todo.model.js');
const app = require('../../index');

chai.config.includeStack = true;

const {todos, users} = require('./../tests/seed/seed');

describe('## Todos APIs', () => {

  describe('#POST /api/todos', ()=>{

    it('should create new todos', (done)=>{
      var title = "First title";
      var text = "Test todo text";

      request(app)
        .post("/api/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({title, text})
        .expect(200)
        .expect((res)=>{
          expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
          if(err){
            done(err);
          }

          Todo.find({text}).then((todo)=>{
            expect(todo.length).toBe(1);
            expect(todo[0].text).toBe(text);
            done();
          }).catch((e)=>{
            done(e)
          });

        });

    });

    it('should not create new todos', (done)=>{
      var title = "First title";
      var text = "Test todo text";

      request(app)
        .post("/api/todos")
        .set("x-auth", users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res)=>{
          if(err){
            done(err);
          }
          Todo.find().then((todo)=>{
            expect(todo.length).toBe(2);
            done();
          }).catch((e)=>{done(e)});

        });

    });

  });

  describe('#GET /api/todos', ()=>{

    it('Get all todos list', (done)=>{

      request(app)
        .get('/api/todos')
        .set("x-auth", users[0].tokens[0].token)
        .send({})
        .expect(200)
        .expect((res)=>{
          expect(res.body.length).toBe(1)
        })
        .end(done);

    });

  });

  describe("#GET /api/todos/:todoId", ()=>{
    it("should get todo by id", (done)=>{
      request(app)
        .get(`/api/todos/${todos[0]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it("should not return todo created by another user", (done)=>{
      request(app)
        .get(`/api/todos/${todos[1]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .expect((res)=>{
          expect(res.body.name).toBe("APIError");
        })
        .end(done);
    });


    it("sholud get 404 if todo is not found", (done)=>{
      var newObjectID = new ObjectID();
      request(app)
        .get(`/api/todos/${newObjectID.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it("sholud get 404 for non-object ID", (done)=>{
      var id = "123124swasd123";
      request(app)
        .get(`/api/todos/${id}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done)
    });

  });

  describe("#DELETE /api/todos/:id",()=>{

    it("should delete a todo", (done)=>{
      var newObjextID = todos[0]._id.toHexString();
      request(app)
        .delete(`/api/todos/${newObjextID}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(newObjextID);
        })
        .end((err, res)=>{
          if(err){
            return done(err);
          }
          Todo.findById(newObjextID).then((todo)=>{
            if(!todo){
              expect(todo).toBeFalsy();
              done();
            }
          }).catch((e)=>{done(e)});

        });
    });

    it("should not delete a todo created by another user", (done)=>{
      var newObjextID = todos[1]._id.toHexString();
      request(app)
        .delete(`/api/todos/${newObjextID}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end((err, res)=>{
          if(err){
            return done(err);
          }

          Todo.findById(newObjextID).then((todo)=>{
            expect(todo).toBeTruthy();
            done();
          }).catch((e)=>{
            done(e);
          });

        });
    });

    it("should return 404 with id not found", (done)=>{
      var newObjextID = new ObjectID().toHexString();
      request(app)
        .delete(`/api/todos/${newObjextID}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it("should return 404 with invalid id", (done)=>{
      request(app)
        .delete(`/api/todos/12345122`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

  });

  describe("PATCH /api/todo/:id", ()=>{

    it("should update todo", (done)=>{
      var newObjectID = todos[0]._id.toHexString();
      var body = {completed: true, text: "updated text hehehhe", title: "updated text hehehhe"};

      try {
        request(app)
          .patch(`/api/todos/${newObjectID}`)
          .set("x-auth", users[0].tokens[0].token)
          .send(body)
          .expect(200)
          .expect((res)=>{
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBeTruthy();
          })
          .end(done);
      } catch (e) {
        return done(e);
      }
    });

    it("should not update todo for another user", (done)=>{
      var newObjectID = todos[1]._id.toHexString();
      var body = {completed: true, text: "updated text hehehhe", title: "updated text hehehhe"};

      try {
        request(app)
          .patch(`/api/todos/${newObjectID}`)
          .set("x-auth", users[0].tokens[0].token)
          .send(body)
          .expect(404)
          .expect((res)=>{
            expect(res.body.name).toBe("APIError");
          })
          .end(done);
      } catch (e) {
        return done(e);
      }

    });

    it("should clear completedAt when todo is not completed", (done)=>{
      var newObjectID = todos[1]._id.toHexString();
      var body = {completed: false, text: "updated text hehehhe", title: "updated text hehehhe"};
      request(app)
        .patch(`/api/todos/${newObjectID}`)
        .set("x-auth", users[1].tokens[0].token)
        .send(body)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.completed).toBeFalsy();
          expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);

    });

  });

});
