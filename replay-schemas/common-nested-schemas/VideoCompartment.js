require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var VideoCompartmentSchema = new Schema({
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
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
