require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var RelativeVideo = require('./common-nested-schemas/RelativeVideo');
var Schema = mongoose.Schema;

// create a schema
var MissionSchema = new Schema({
	missionName: {
		type: String,
		required: true
	},
	sourceId: {
		type: String,
		required: true
	},
	boundingPolygon: mongoose.Schema.Types.GeoJSON,
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
	destination: {
		type: String,
		required: true
	},
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	ContainedVideos: [RelativeVideo],
	videoStatus: {
		type: String,
		enum: ['new', 'updated', 'deleted', 'error', 'handled', 'handledDeleted'],
		default: 'new',
		required: true
	}},
	{
		timestamps: true
	});

// VideoSchema.pre('save', setNewStatus);
// VideoSchema.pre('update', setUpdatedStatus);
MissionSchema.pre('save', calculateDuration);
MissionSchema.pre('update', calculateDuration);

var Mission = mongoose.model('Mission', MissionSchema);

module.exports = Mission;

// function setNewStatus(next) {
// 	var self = this;
// 	self.videoStatus = 'new';
// 	next();
// }

// function setUpdatedStatus(next) {
// 	var self = this;
// 	self.videoStatus = 'updated';
// 	next();
// }

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}

function calculateDuration(next) {
	var self = this;
	var differenceInMillis = self.endTime - self.startTime;
	self.durationInSeconds = differenceInMillis / 1000;
	next();
}
