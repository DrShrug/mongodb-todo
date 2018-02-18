const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');
const { authenticate } = require('./../../middleware/authenticate');

var router = express.Router();

// [GET] Groups
router.get('/groups', authenticate, (req, res) => {
  Group.find({ members: req.user._id }).then((groups) => {
    res.send(groups);
  }, (err) => {
    res.status(400).send(e);
  });
});

// [POST] New group
router.post('/groups', authenticate, (req, res) => {
  var newId = new ObjectID();
  var group = new Group({
    _id: newId,
    groupName: req.body.groupName,
    _owner: req.user._id
  });
  group.members.push(req.user._id);
  group.save().then((doc) => {
    User.findOneAndUpdate({ _id: req.user._id }, {
      $push: {
        "groups": newId
      }
    }).then((user) => {
      if (!user) {
        return res.status(404).send();
      }
    }).catch((e) => {
      res.status(400).send(e);
    })
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  })
});

// [PATCH] Add member (in body) to group Id (in params)
router.patch('/groups/addmember/:id', authenticate, (req, res) => {
  var groupId = req.params.id;
  if (!ObjectID.isValid(groupId)) {
    return res.status(404).send('Invalid group Id');
  }

  User.findById(req.body.userIdToAdd, (err, user) => {
    if (!user) {
      return res.status(404).send('User not found 1');
    }
    
    var alreadyInGroup = user.groups.some((group) => {
      return group.equals(groupId);
    })

    if (!alreadyInGroup) {
      Group.findOneAndUpdate({ _id: groupId }, { 
        $push: {
          "members": req.body.userIdToAdd
        }
      }).then((group) => {
        if (!group) {
          return res.status(404).send();
        }
        
        User.findOneAndUpdate({ _id: req.body.userIdToAdd }, {
          $push: {
            "groups": group._id
          }
        }).then((user) => {
          if (!user) {
            return res.status(404).send('User not found');
          }
          
        }).catch((e) => {
          res.status(400).send(e);
        })

        res.send(_.pick(user, ['_id', 'username', 'displayName', 'email']));
      }).catch((e) => {
        res.status(400).send(e);
      })
    } else {
      return res.status(400).send({ message: 'Already in group' });
    }
  });
});

// [PATCH] Remove member (in body) from group Id (in params)
router.patch('/groups/removemember/:id', authenticate, (req, res) => {
  var groupId = req.params.id;
  if (!ObjectID.isValid(groupId)) {
    return res.status(404).send();
  }
  Group.findOne({ _id: groupId}).then((group) => {
    if (!group) {
      return res.status(404).send();
    }
    
    if (group._owner.equals(req.body.userIdToRemove)) {
      return res.status(400).send({ message: 'Cannot remove group owner as member'});
    }
    if (group.members.includes(req.body.userIdToRemove)) {
      return res.status(400).send({ message: 'User is not in group'});
    }

    Group.findOneAndUpdate({ _id: groupId }, {
      $pull: {
        "members": req.body.userIdToRemove
      }
    }).then((group) => {
      if (!group) {
        return res.status(404).send();
      }
      User.findOneAndUpdate({ _id: req.body.userIdToRemove}, {
        $pull: {
          "groups": group._id
        }
      }).then((user) => {
        if (!user) {
          return res.status(404).send();
        }
        res.send(_.pick(user, ['_id', 'username', 'displayName', 'email']));
      }).catch((e) => {
        res.status(400).send(e);
      })
      
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
});

// [DELETE] Group by Id
router.delete('/groups/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Group.findOneAndRemove({
    _id: id,
    _owner: req.user._id
  }).then((group) => {
    if (!group) {
      return res.status(404).send();
    }
    User.update({
      _id: { $in: group.members }
    }, { $pull: { groups: group._id }}, {
      multi: true
    }).catch((e) => res.status(400).send());
    res.status(200).send({ group });
  }, (e) => {
    res.status(400).send(e);
  });
});

module.exports.router = router;