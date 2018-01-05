require('./config/config');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const cors = require('cors');

const port = process.env.PORT || 3000

var app = express();

app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['x-auth', 'X-Auth', 'Content-Type']
}));

app.get('/', (request, response) => {
    response.render(`${ __dirname }/public/index.html`)
});

app.get('/test', (req, res) => {
    res.send({
        test: 'Completed'
    });
});

// Add new todo and return it
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        task: req.body.task,
        completedDateLimit: req.body.completedDateLimit,
        _creator: req.user._id,
        creatorName: req.user.email
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

// Returns all todos
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(e);
    });
});


// Return todo by ID 
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user.id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }, (e) => {
        res.status(400).send(e)
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user.id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['task', 'completed', 'completedDateLimit']);
    
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedTime = new Date().getTime();
    } else {
        body.completedTime = null;
        body.completed = false;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user.id
    }, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo})
        }).catch((e) => {
            res.status(400).send();
        });
});


/*
*   USER METHODS
*/
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
})

app.delete('/users/me/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server started on port ${ port }`);
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
