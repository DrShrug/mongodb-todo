const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedTime: {
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
}