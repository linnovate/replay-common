// populated mongoose types with geo json schemas
require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var ReceivingMethod = require('./common-nested-schemas/ReceivingMethod');
var Schema = mongoose.Schema;

// create a schema
var VideoSchema = new Schema({
	sourceId: {
		type: String,
		required: true
	},
	provider: {
		type: String,
		enum: ['kaltura', 'none'],
		defalut:'none'
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
	videoMainFileName: {
		type: String,
		validate: {
			validator: videoMainFileNameValidator
		},
		required: true
	},
	flavors: {
		type: [String],
		required: true
	},
	format: {
		type: String,
		enum: ['mp4', 'smil'],
		required: true
	},
	receivingMethod: ReceivingMethod,
	status: {
		type: String,
		enum: ['processing', 'ready'],
		default: 'processing'
	},
	boundingPolygon: mongoose.Schema.Types.GeoJSON,
	jobStatusId: {
		type: String,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		validate: validateGreaterThanStartTime,
		required: true
	},
	durationInSeconds: {
		type: Number
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	copyright: {
		type: String
	}
}, {
	timestamps: true
});

VideoSchema.pre('save', calculateDuration);
VideoSchema.pre('update', calculateDuration);

var Video = mongoose.model('Video', VideoSchema);

module.exports = Video;

function calculateDuration(next) {
	var self = this;
	var differenceInMillis = self.endTime - self.startTime;
	self.durationInSeconds = differenceInMillis / 1000;
	next();
}

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}

function videoMainFileNameValidator(fileName) {
	if(fileName.endsWith('.mp4') || fileName.endsWith('.smil'))
		return true;
	return false;
}
