const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');
const { authenticate } = require('./../../middleware/authenticate');

var router = express.Router();

// [POST] New user
router.post('/users', (req, res) => {
  var body = _.pick(req.body, ['username', 'displayName', 'email', 'password'])
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {  
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// [POST] Authenticate user
router.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
})

// [DELETE] User logout
router.delete('/users/me/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

// [GET] User info
router.get('/users/me', authenticate, (req, res) => {
  var userToJson = req.user.toJSON();
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    userToJson.todoList = {todos};
    res.send(userToJson);
  }, (err) => {
    res.status(400).send(e);
  });
});

module.exports.router = router;