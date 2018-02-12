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

// Called by DELETE Category route
categorySchema.pre('findOneAndRemove', function (next) {
  Todo.remove({ _category: this._conditions._id._id}).exec();
  next();
});

// Called by Group DELETE route middleware
categorySchema.post('remove', (doc) => {
  Todo.remove({ _category: doc._id }).exec();
});


var Category = mongoose.model('Category', categorySchema);

module.exports = {
  Category
}