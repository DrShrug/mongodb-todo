const mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
  groupName: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 30,
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

var Group = mongoose.model('Group', groupSchema);

module.exports = {
    Group
}