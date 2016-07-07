var nestedValidator = require('./services/nested-model-validator');

var VideoMetadata = {

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
			model: 'receivingmethod',
			required: true
		},
		timestamp: {
			type: 'date'
		},
		sensorPosition: {
			model: 'coordinate'
		},
		sensorTrace: {
			model: 'geojson'
		},
		data: {
			type: 'json'
		}
	}
};

module.exports = VideoMetadata;
