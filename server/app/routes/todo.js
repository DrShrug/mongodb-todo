const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');
const { authenticate } = require('./../../middleware/authenticate');

var router = express.Router();

// [POST] New todo inside category Id belonging to group Id
router.post('/:groupId/:categoryId/todos', authenticate, (req, res) => {
  var todo = new Todo({
    task: req.body.task,
    completeByTime: req.body.completeByTime,
    _creator: req.user._id,
    _category: req.params.categoryId,
    _group: req.params.groupId
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});

// [GET] Todos from group Id
router.get('/:groupId/todos', authenticate, (req, res) => {
  Todo.find({
    _group: req.params.groupId
  }).then((todos) => {
    res.send({ todos });
  }, (err) => {
    res.status(400).send(e);
  });
});

// [GET] Todos from category Id belonging to a group Id
router.get('/:groupId/:categoryId/todos/', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.groupId) || !ObjectID.isValid(req.params.categoryId)) {
    return res.status(404).send();
  }

  Todo.find({
    _group: req.params.groupId,
    _category: req.params.categoryId
  }).then((todos) => {
    if (!todos) {
      return res.status(404).send()
    }
    res.send({ todos })
  }, (e) => {
    res.status(400).send(e)
  });
});

// [DELETE] Todo from todo Id
router.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({ todo });
  }, (e) => {
    res.status(400).send(e);
  });
});

// [PATCH] Todo from todo Id
router.patch('/todos/:id', authenticate, (req, res) => {
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

module.exports.router = router;