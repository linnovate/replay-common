var coordinatesValidator = require('./services/attributes-validators/coordinates');

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
		receivingMethodStandard: {
			type: 'string',
			enum: ['VideoStandard', 'stanag'],
			required: true
		}
		receivingMethodVersion: {
			type: 'string',
			enum: ['0.9', '1.0', '4609'],
			required: true
		},
		timestamp: {
			type: 'date'
		},
		sensorPositionLat: {
			type: 'float'
		},
		sensorPositionLon: {
			type: 'float'
		},
		sensorTraceShape: {
			type: 'string',
			enum: ['polygon']
		},
		sensorTraceCoordinates: {
			type: 'array',
			isCoordinatesArray: true
		},
		data: {
			type: 'json'
		}
	},

	types: {
		isCoordinatesArray: coordinatesValidator
	}
};

module.exports = VideoMetadata;
