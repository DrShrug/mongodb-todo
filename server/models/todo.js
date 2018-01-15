const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAtTime: {
        type: Number,
        default: null
    },
    completeByTime: {
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