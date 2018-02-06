const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');
const { authenticate } = require('./../../middleware/authenticate');

const router = express.Router();

// [POST] New category inside group Id
router.post('/:groupId/categories', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.groupId)) {
    return res.status(400).send();
  }
  var newId = new ObjectID();
  var category = new Category({
    _id: newId,
    categoryName: req.body.categoryName,
    _creator: req.user._id,
    _group: req.params.groupId
  });

  category.save().then((doc) => {
    Group.findOneAndUpdate({ _id: req.params.groupId }, {
      $push: {
        "categories": category._id
      }
    }).catch((e) => {
      return res.status(400).send(e);
    });
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  })
});

// [GET] Categories inside group Id
router.get('/:groupId/categories/', authenticate, (req, res) => {
  Group.findOne({ _id: req.params.groupId }).then((group) => {
    if (!group) {
      return res.status(404).send();
    }

    Category.find({
      _group: group._id
    }).then((categories) => {
      res.send({ categories });
    }, (err) => {
      res.status(400).send(e);
    });
  });
});

// [PATCH] Category inside group Id
router.patch('/categories/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['categoryName']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  Category.findOneAndUpdate({
    _id: id,
    _creator: req.user.id
  }, { $set: body }, { new: true })
  .then((category) => {
    if (!category) {
      return res.status(404).send();
    }
    res.send({ category });
  }).catch((e) => {
    res.status(400).send();
  })
});

// [DELETE] Category Id belonging to group Id
router.delete('/:groupId/categories/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Category.findByIdAndRemove({
    _id: id,
  }).then((category) => {
    if (!category) {
      return res.status(404).send();
    }

    Group.findOneAndUpdate({ _id: req.params.groupId }, {
      $pull: {
        "categories": category._id
      }
    }).catch((e) => {
      return res.status(400).send(e);
    });

    res.status(200).send({ category });
  }, (e) => {
    res.status(400).send(e);
  });
});

module.exports.router = router;