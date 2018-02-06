const mongoose = require('mongoose');
const { Todo } = require('./todo');

var categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    _group: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

categorySchema.pre('findOneAndRemove', function (next) {
    Todo.deleteMany({ _category: this._conditions._id._id }, (err) => console.log(err));
    next();
});

var Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category
}