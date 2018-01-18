require('./config/config');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { Category } = require('./models/category');
const { authenticate } = require('./middleware/authenticate');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const cors = require('cors');

const port = process.env.PORT || 3000

var app = express();

app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: ['x-auth', 'X-Auth', 'Content-Type']
}));

app.post('/categories', authenticate, (req, res) => {
  var category = new Category({
    categoryName: req.body.categoryName,
    _creator: req.user._id,
    creatorName: req.user.email
  });

  category.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  })
});

app.get('/categories', authenticate, (req, res) => {
  Category.find({
    _creator: req.user._id
  }).then((categories) => {
    res.send({ categories });
  }, (err) => {
    res.status(400).send(e);
  });
});

app.patch('/categories/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['categoryName']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Category.findOneAndUpdate({
    _id: id,
    _creator: req.user.id
  }, { $set: body }, { new: true})
  .then((category) => {
    if (!category) {
      return res.status(404).send();
    }
    res.send({ category });
  }).catch((e) => {
    res.status(400).send();
  })
});

app.delete('/categories/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Category.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((category) => {
    if (!category) {
      return res.status(404).send();
    }
    Todo.deleteMany({
      _category: id
    }).then((todo) => {
      res.status(200).send(todo);
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// Add new todo and return it
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    task: req.body.task,
    completeByTime: req.body.completeByTime,
    _creator: req.user._id,
    creatorName: req.user.email,
    _category: req.body._category,
    categoryName: req.body.categoryName
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
    res.send({ todos });
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
    if (!todo) {
      return res.status(404).send()
    }
    res.send({ todo })
  }, (e) => {
    res.status(400).send(e)
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({ todo });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['task', 'isCompleted', 'completeByTime', '_category', 'categoryName']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.isCompleted) && body.isCompleted) {
    body.completedAtTime = new Date().getTime();
  } else {
    body.completedAtTime = null;
    body.isCompleted = false;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user.id
  }, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo })
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
  var userToJson = req.user.toJSON();
  userToJson.test = 'test';
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    userToJson.todoList = {todos};
    res.send(userToJson);
  }, (err) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app
}
