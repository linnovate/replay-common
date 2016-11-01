require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var VideoCompartment = require('./VideoCompartment');

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
MissionSchema.pre('save', calculateDuration);
MissionSchema.pre('update', calculateDuration);

var Mission = mongoose.model('Mission', MissionSchema);

module.exports = Mission;

Mission.validateMissionExists = function (missionId, permissions) {
	console.log('Validating that mission with id %s exists and user has permissions for it...', missionId);

	return findMissions(missionId, permissions)
		.then((mission) => {
			if (mission) {
				return Promise.resolve(mission);
			}

			return Promise.reject(new Error(`Mission with id ${missionId} does not exist or user has no permissions for it.`));
		});
};

function findMissions(missionId, permissions) {
	var query = {
		$and: [
			{ _id: missionId },
			VideoCompartment.buildQueryCondition(permissions)
		]
	};
	return Mission.findOne(query);
}

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
