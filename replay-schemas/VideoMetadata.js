var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var VideoMetadataSchema = new Schema({
	sourceId: {
		type: Number,
		required: true
	},
	videoId: {
		type: String
	},
	receivingMethod: {
		standard: { type: String, required: true },
		version: { type: String, required: true }
	},
	timestamp: {
		type: Date
	},
	sensorPosition: {
		lat: { type: Number },
		lon: { type: Number }
	},
	sensorTrace: { // Geo-Json
		type: { type: String, enum: ['polygon'] },
		coordinates: Schema.Types.Mixed // Geo-Json coordinates are [[lon,lat]]
	},
	data: {
		type: Schema.Types.Mixed
	}
});

var VideoMetadata = mongoose.model('VideoMetadata', VideoMetadataSchema);

module.exports = VideoMetadata;
