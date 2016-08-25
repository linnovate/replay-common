var mongoose = require('mongoose');
require('mongoose-type-email');

var Schema = mongoose.Schema;

// create a schema
var UserSchema = new Schema({
	email: {
		type: mongoose.SchemaTypes.Email,
		unique: true,
		required: true
	},
	password: {
		type: String
	},
	displayName: {
		type: String
	},
	picture: {
		type: String
	},
	google: {
		type: String
	},
	facebook: {
		type: String
	}
}, {
	timestamps: true
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
