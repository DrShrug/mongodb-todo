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
    },
    completedDateLimit: {
        type: Number,
        default: null,
        required: true
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    creatorName: {
        required: true,
        type: String
    }
});

module.exports = {
    Todo
}