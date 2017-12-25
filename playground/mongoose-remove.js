const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Delete by more than 1 property
// Todo.findOneAndRemove({
//         _id: '5a417b368c760600147673f6'
//     }).then((todo) => {
//         console.log(todo);
// });

// Todo.findByIdAndRemove('5a417b368c760600147673f6').then((todo) => {
//     console.log(todo);
// });