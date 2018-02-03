const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		minlength: 1,
		maxlength: 30,
		trim: true,
		validate: [{
			validator: value => validator.isAlphanumeric(value),
			message: 'Alpha-numeric characters only'
		}]
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 30,
		trim: true,
		unique: true,
		validate: [{
				validator: value => validator.isEmail(value),
				message: 'Invalid email'
		}]
	},
	displayName: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 30,
		trim: true,
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	groups: [{ 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	}],
	tokens: [{
		access: {
				type: String,
				required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
}, {
	usePushEach: true,
});

userSchema.index({ 'groups': 1 });

userSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({
		_id: user._id.toHexString(),
		access,
	}, process.env.JWT_SECRET);

	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {
		return token;
	});
};

userSchema.methods.removeToken = function (token) {
	var user = this;

	return user.update({
		$pull: {
			tokens: {token}
		}
	})
};

userSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
};

userSchema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({ email }).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		})
	});
};

userSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
		});
	});
	} else {
		next();
	}
});

userSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'username', 'displayName', 'email'])
};

var User = mongoose.model('User', userSchema);

module.exports = {
		User
}