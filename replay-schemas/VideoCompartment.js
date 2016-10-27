require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var VideoCompartmentSchema = new Schema({
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	classificationId: {
		type: Schema.Types.ObjectId,
		ref: 'Mission'
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
	startAsset: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	destination: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var VideoCompartment = mongoose.model('VideoCompartment', VideoCompartmentSchema);

module.exports = VideoCompartment;

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}

VideoCompartment.buildQueryCondition = function(permissions) {
	console.log('Building mongo query compartment condition with given permissions...');
	try {
		var query = { $or: [] };
		for (var i = 0; i < permissions.length; i++) {
			query.$or.push({
				destination: permissions[i].id[0]
			});
			if (i === permissions.length - 1) {
				return query;
			}
		}
	} catch (err) {
		console.log('Error in building mongo query compartment condition');
		console.log(err);
		throw err;
	}
};
