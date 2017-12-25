const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a40489ac5af3e0584461a68';

// if (!ObjectID.isValid(id)) {
//     console.log('Invalid Id');
// }

User.findById(id).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User', user);
}).catch((e) => console.log('Error', e));

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));