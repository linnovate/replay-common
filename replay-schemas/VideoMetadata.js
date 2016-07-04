var Waterline = require('waterline'),
	nestedValidator = require('./services/nested-model-validator');

var VideoMetadata = Waterline.Collection.extend({

	identity: 'videometadata',
	connection: 'mongo',
	schema: true,

	attributes: {
		sourceId: {
			type: 'string',
			required: true
		},
		videoId: {
			type: 'string'
		},
		receivingMethod: {
			type: 'json',
			required: true
		},
		timestamp: {
			type: 'date'
		},
		sensorPosition: {
			type: 'json',
			validateCoordinate: true
		},
		sensorTrace: {
			type: 'json',
			validateGeoJson: true
		},
		data: {
			type: 'json'
		}
	},

	types: {
		validateReceivingMethod: function(obj) {
			return nestedValidator(global.models.receivingmethod, obj);
		},

		validateCoordinate: function(obj) {
			return nestedValidator(global.models.coordinate, obj);
		},

		validateGeoJson: function(obj) {
			return nestedValidator(global.models.geojson, obj);
		}
	}
});

module.exports = VideoMetadata;
