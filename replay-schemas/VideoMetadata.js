var GeoJson = require('mongoose-geojson-schema'),
	mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ReceivingMethod = require('./common-nested-schemas/ReceivingMethod');

// create a schema
var VideoMetadataSchema = new Schema({
	sourceId: {
		type: String,
		required: true
	},
	videoId: {
		type: String
	},
	receivingMethod: ReceivingMethod,
	timestamp: {
		type: Date
	},
	sensorPosition: {
		lat: { type: Number },
		lon: { type: Number }
	},
	sensorTrace: mongoose.Schema.Types.Polygon,
	data: {
		type: Schema.Types.Mixed
	}
},
{
	timestamps: true
});

var VideoMetadata = mongoose.model('VideoMetadata', VideoMetadataSchema);

module.exports = VideoMetadata;
