const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        task: req.body.task
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = {
    app
}

// var newTodo = new Todo({
//     task: 'Feed the cat',
// });

// var newUser = new User({
//     username: 'Lasagna Larry',
//     email: 'lasagna@larry.com'
// });

// newTodo.save().then((result) => {
//     console.log('Saved', result)
// }, (error) => {
//     console.log('Error', error)
// });

// newUser.save().then((result) => {
//     console.log('Saved', result);
// }, (error) => {
//     console.log('Error', error);
// });
