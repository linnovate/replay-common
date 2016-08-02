var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	GeoJson = require('./common-nested-schemas/GeoJson');

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
	sourceId: {
		type: String
	},
	tagsIds: {
		type: [String]
	},
	boundingShape: GeoJson
},
{
	timestamps: true
});

var Query = mongoose.model('Query', QuerySchema);

module.exports = Query;

