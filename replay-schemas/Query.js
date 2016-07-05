var Waterline = require('waterline'),
	nestedValidator = require('./services/nested-model-validator');

var Query = Waterline.Collection.extend({

	identity: 'query',
	connection: 'mongo',
	schema: true,

	attributes: {
		fromVideoTime: {
			type: 'date',
		},
		toVideoTime: {
			type: 'date'
		},
		minVideoDuration: {
			type: 'integer'
		},
		maxVideoDuration: {
			type: 'integer'
		},
		copyright: {
			type: 'string'
		},
		minTraceHeight: {
			type: 'integer'
		},
		minTraceWidth: {
			type: 'integer'
		},
		source: {
			type: 'string'
		},
		boundingPolygon:{
			type: 'json',
			validateGeoJson: true
		}
	},

	types: {
		validateGeoJson: function(obj) {
			// validate we get only polygon, as well as valid Geo-Json
			return obj.type !== 'polygon' || nestedValidator(global.models.geojson, obj);
		}
	}
});

module.exports = Query;
