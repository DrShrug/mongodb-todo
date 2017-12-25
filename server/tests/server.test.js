const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    task: 'First task',
    completed: false,
    completedTime: null
}, {
    _id: new ObjectID(),
    task: 'Second task',
    completed: true,
    completedTime: 10
}];

beforeEach((done) => {
    Todo.remove({}).then(() => { 
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var task = 'To do tests';
        request(app)
            .post('/todos')
            .send({task})
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

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e))
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo', (done) => {
        request(app)
            .get(`/todos/${ todos[0]._id.toHexString() }`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.task).toBe(todos[0].task);
            })
            .end(done);
    });

    it('should return 404 if not found', (done) => {
        request(app)
            .get(`/todos/${ new ObjectID().toHexString() }`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete one todo', (done) => {
        var hex = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${ hex }`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hex);
            })
            .end((e, res) => {
                if (e) {
                    return done(e);
                }
                Todo.findById(hex).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return 404 if not found', (done) => {
        request(app)
            .delete(`/todos/${ new ObjectID().toHexString() }`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    })
});

describe('PATCH /todos/:id', () => {
    it('should change todo', (done) => {
        var hex = todos[0]._id.toHexString();
        var task = 'Changed task';
        request(app)
            .patch(`/todos/${ hex }`)
            .send({
                completed: true,
                task
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.task).toBe(task);
                expect(res.body.todo.completedTime).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedTime when completed set to false', (done) => {
        var hex = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${ hex }`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedTime).toNotExist();
            })
            .end(done);
    });
});