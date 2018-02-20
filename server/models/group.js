const mongoose = require('mongoose');
const { Category } = require('./category');

var groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 30,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    trim: true
  },
  _owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }]
});

groupSchema.index({ 'members': 1 });

groupSchema.pre('findOneAndRemove', function (next) {
  Category.find({ _group: this._conditions._id }).then((categories) => {
    categories.forEach((category) => {
      category.remove();
    });
  });
  next();
});

var Group = mongoose.model('Group', groupSchema);

module.exports = {
  Group
}