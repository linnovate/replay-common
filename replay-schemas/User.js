var mongoose = require('mongoose');
require('mongoose-type-email');

var Schema = mongoose.Schema;

// create a schema
var UserSchema = new Schema({
	email: {
		type: mongoose.SchemaTypes.Email,
		unique: true
	},
	displayName: {
		type: String,
		required: true
	},
	pictureUri: {
		type: String
	},
	providerDetails: {
		name: {
			type: String,
			enum: ['google', 'adfs-saml'],
			required: true
		},
		id: {
			type: String,
			unique: true,
			required: true
		}
	}
}, {
	timestamps: true
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
