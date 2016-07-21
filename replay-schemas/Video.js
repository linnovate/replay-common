var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ReceivingMethod = require('./common-nested-schemas/ReceivingMethod');

// create a schema
var VideoSchema = new Schema({
	sourceId: {
		type: String,
		required: true
	},
	provider: {
		type: String,
		enum: ['kaltura']
	},
	providerId: {
		type: String
	},
	relativePath: {
		type: String,
		required: true
	},
	providerData: {
		type: Schema.Types.Mixed
	},
	name: {
		type: String,
		required: true
	},
	receivingMethod: ReceivingMethod,
	status: {
		type: String,
		enum: ['processing', 'ready'],
		default: 'processing'
	},
	jobStatusId: {
		type: String,
		required: true
	}
},
{
	timestamps: true
});

var Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
