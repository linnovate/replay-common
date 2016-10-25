require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var VideoCompartmentSchema = new Schema({
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	sourceId: {
		type: String,
		required: true
	},
	classificationId: {
		type: Schema.Types.ObjectId,
		ref: 'Classification'
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
	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	destination: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var VideoCompartment = mongoose.model('VideoCompartment', VideoCompartmentSchema);

module.exports = {
	VideoCompartment: VideoCompartment
};

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}
