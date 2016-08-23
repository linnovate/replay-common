// populated mongoose types with geo json schemas
require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create a schema
var QuerySchema = new Schema({
	fromVideoTime: {
		type: Date
	},
	toVideoTime: {
		type: Date
	},
	minVideoDuration: {
		type: Number
	},
	maxVideoDuration: {
		type: Number
	},
	copyright: {
		type: String
	},
	minTraceHeight: {
		type: Number
	},
	minTraceWidth: {
		type: Number
	},
	minMinutesInsideShape: {
		type: Number
	},
	sourceId: {
		type: String
	},
	tagsIds: {
		type: [String]
	},
	boundingShape: mongoose.Schema.Types.GeoJSON
}, {
	timestamps: true
});

var Query = mongoose.model('Query', QuerySchema);

module.exports = Query;
