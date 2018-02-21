const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');

const idUser1 = new ObjectID();
const idUser2 = new ObjectID();

const idGroup1 = new ObjectID();
const idGroup2 = new ObjectID();

const idCategory1 = new ObjectID();
const idCategory2 = new ObjectID();

const users = [
  // User 1
  {
    _id: idUser1,
    email: 'user1@test.com',
    username: 'user1',
    displayName: 'user 1 display',
    password: 'user1pwd',
    groups: [{
      idGroup1,
    }],
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: idUser1, access: 'auth'}, 'randomsecret').toString()
    }],
  },
  
  // User 2
  {
    _id: idUser2,
    email: 'user2@test.com',
    username: 'user2',
    displayName: 'user 2 display',
    password: 'user2pwd',
    groups: [{
      idGroup1,
      idGroup2
    }],
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: idUser2, access: 'auth'}, 'randomsecret').toString()
    }]
  }
];

const todos = [
  // Todo 1
  {
    _id: new ObjectID(),
    text: 'Created by user 1',
    _creator: idUser1,
    _group: idGroup1,
    _category: idCategory1
  },

  // Todo 2
  {
    _id: new ObjectID(),
    task: 'Created by user 2',
    isCompleted: true,
    completedAtTime: 333,
    _creator: idUser2,
    _group: idGroup2,
    _category: idCategory2
  }
];

const groups = [
  // Group 1
  {
    _id: idGroup1,
    groupName: 'Group 1',
    description: 'Created by user 1',
    _owner: idUser1,
    members: [{
      idUser1,
      idUser2
    }],
    categories: [{ idCategory1 }]
  },

  // Group 2
  {
    _id: idGroup2,
    groupName: 'Group 2',
    description: 'Created by user 2',
    _owner: idUser2,
    members: [{
      idUser2
    }],
    categories: [{ idCategory2 }]
  },
]

const categories = [
  // Category 1
  {
    _id: idCategory1,
    categoryName: 'Category 1',
    _creator: idUser1,
    _group: idGroup1
  },

  // Category 2
  {
    _id: idCategory1,
    categoryName: 'Category 1',
    _creator: idUser1,
    _group: idGroup1
  },
]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

const populateGroups = (done) => {
  Group.remove({}).then(() => {
    return Group.insertMany(groups);
  }).then(() => done());
}

const populateCategories = (done) => {
  Category.remove({}).then(() => {
    return Category.insertMany(categories);
  }).then(() => done());
}

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
  groups,
  populateGroups,
  categories,
  populateCategories
};
