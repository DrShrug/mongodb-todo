const mongoose = require('mongoose');

var Category = mongoose.model('Category', {
    categoryName: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        trim: true
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    creatorName: {
        required: true,
        type: String
    },
});

module.exports = {
    Category
}