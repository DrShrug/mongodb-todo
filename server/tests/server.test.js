const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../app/server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { Group } = require('./../models/group');
const { Category } = require('./../models/category');
const { todos, populateTodos,
        users, populateUsers, 
        groups, populateGroups,
        categories, populateCategories } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateGroups);
beforeEach(populateCategories);
beforeEach(populateTodos);

describe('Todo Calls', () => {
  it('should deny access', (done) => {
    var groupId = groups[0]._id;

    request(app)
      .get(`/${groupId}/todos`)
      .expect(401)
      .end(done);
  });

  it('should create a new todo', (done) => {
    var task = 'New todo';
    var completeByTime = 12512412412;
    var _creator = users[0]._id;
    var _category = categories[0]._id;
    var _group = groups[0]._id;

    request(app)
      .post(`/${_group}/${_category}/todos`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ task, completeByTime, _creator, _category, _group })
      .expect(200)
      .expect((res) => {
        expect(res.body.task).toBe(task);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e))
      });
  });

  it('should not create a todo', (done) => {
    var _category = categories[0]._id;
    var _group = groups[0]._id;

    request(app)
      .post(`/${_group}/${_category}/todos`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return 1 todo from category 1', (done) => {
    var _category = categories[0]._id;
    var _group = groups[0]._id;

    request(app)
      .get(`/${_group}/${_category}/todos`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
        expect(res.body.todos[0].task).toBe(todos[0].task);
      }).end(done);
  });

  it('should not return 1 todo from category 2', (done) => {
    var _category = categories[0]._id;
    var _group = groups[0]._id;

    request(app)
      .get(`/${_group}/${_category}/todos`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
        expect(res.body.todos[0].task).toNotBe(todos[1].task);
      }).end(done);
  })

  it('should patch a todo', (done) => {
    var todoId = todos[0]._id;
    var oldTask = todos[0].task;
    var task = 'Modified task';

    request(app)
      .patch(`/todos/${todoId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ task, isCompleted: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.task).toBe(task);
        expect(res.body.todo.task).toNotBe(oldTask);
        expect(res.body.todo.isCompleted).toBe(true);
        expect(res.body.todo.completedAtTime).toBeA('number');
      }).end(done);
  });

  it('should clear completedAtTime when not completed', (done) => {
    var todoId = todos[1]._id;

    request(app)
    .patch(`/todos/${todoId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({ isCompleted: false })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.isCompleted).toBe(false);
      expect(res.body.todo.completedAtTime).toNotExist();
    }).end(done);
  });

  it('should delete a todo', (done) => {
    var todoId = todos[0]._id;

    request(app)
      .delete(`/todos/${todoId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        Todo.findById(todoId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('Category Calls', () => {
  it('should deny access', (done) => {
    var groupId = groups[0]._id;

    request(app)
      .get(`/${groupId}/categories`)
      .expect(401)
      .end(done);
  });

  it('should create a new category', (done) => {
    var categoryName = 'New category';
    var groupId = groups[0]._id;

    request(app)
      .post(`/${groupId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ categoryName })
      .expect(200)
      .expect((res) => {
        expect(res.body.categoryName).toBe(categoryName);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Category.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e))
      });
  });

  it('should not create a category', (done) => {
    var groupId = groups[0]._id;

    request(app)
      .post(`/${groupId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end(done);
  });

  it('should get all categories of a group', (done) => {
    var groupId = groups[0]._id;
    request(app)
      .get(`/${groupId}/categories`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.categories.length).toBe(1);
        expect(res.body.categories[0]._id).toBe(categories[0]._id.toHexString());
      }).end(done);
  });

  it('should patch a category', (done) => {
    var categoryId = categories[0]._id;
    var categoryName = 'Changed category name';

    request(app)
      .patch(`/categories/${categoryId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ categoryName })
      .expect(200)
      .expect((res) => {
        expect(res.body.category.categoryName).toBe(categoryName);
      }).end(done);
  });

  it('should delete a category', (done) => {
    var categoryId = categories[0]._id;
    var groupId = groups[0]._id;

    request(app)
      .delete(`/${groupId}/categories/${categoryId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Category.findById(categoryId).then((category) => {
          expect(category).toNotExist();
          done();
        }).catch(e => done(e));
      });
  });
});