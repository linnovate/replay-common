var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ClassificationSchema = new Schema({
	missionName: {
		type: String,
		required: true
	},
	karonName: {
		type: String,
		required: true
	},
	source: {
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

	destination: {
		type: String,
		required: true
	},

	videoStatus: {
		type: String,
		enum: ['new', 'updated', 'deleted', 'error', 'handled', 'handledDeleted'],
		default: 'new',
		required: true
	}},
	{
		timestamps: true
	});

//VideoSchema.pre('save', setNewStatus);
//VideoSchema.pre('update', setUpdatedStatus);

var Classification = mongoose.model('Classification', ClassificationSchema);

module.exports = Classification;

function setNewStatus(next) {
	var self = this;
	self.videoStatus = 'new';
	next();
}

function setUpdatedStatus(next) {
	var self = this;
	self.videoStatus = 'updated';
	next();
}

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}
