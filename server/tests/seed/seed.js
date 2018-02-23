const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { Group } = require('./../../models/group');
const { Category } = require('./../../models/category');

const idUser1 = new ObjectID();
const idUser2 = new ObjectID();
const idUser3 = new ObjectID();

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
      _id: idGroup1,
    }],
    tokens: [{
      access: 'auth',
      token: jwt.sign({ _id: idUser1, access: 'auth'}, process.env.JWT_SECRET).toString()
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
      _id: idGroup1,
    }, {
      _id: idGroup2
    }
  ],
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: idUser2, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },

  // User 3
  {
    _id: idUser3,
    email: 'user3@test.com',
    username: 'user3',
    displayName: 'user 3 display',
    password: 'user3pwd',
    groups: [{
      _id: idGroup2
    }],
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: idUser3, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

const todos = [
  // Todo 1
  {
    _id: new ObjectID(),
    task: 'Created by user 1',
    completeByTime: 1519249292280,
    _creator: idUser1,
    _group: idGroup1,
    _category: idCategory1
  },

  // Todo 2
  {
    _id: new ObjectID(),
    task: 'Created by user 2',
    isCompleted: true,
    completeByTime: 1519249248395,
    completedAtTime: 1519249248900,
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
      _id: idUser1, 
    }, {
      _id: idUser2,
    }, {
      _id: idUser3
    }],
    categories: [{ _id: idCategory1 }]
  },

  // Group 2
  {
    _id: idGroup2,
    groupName: 'Group 2',
    description: 'Created by user 2',
    _owner: idUser2,
    members: [{
      _id: idUser2
    }],
    categories: [{ _id: idCategory2 }]
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
    _id: idCategory2,
    categoryName: 'Category 2',
    _creator: idUser2,
    _group: idGroup2
  },
]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    var userThree = new User(users[2]).save();

    return Promise.all([userOne, userTwo, userThree])
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
