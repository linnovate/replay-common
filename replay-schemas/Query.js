var coordinatesValidator = require('./services/attributes-validators/coordinates'),
	_ = require('lodash');

module.exports = {

	identity: 'query',
	connection: 'mongo',
	schema: true,

	attributes: {
		fromVideoTime: {
			type: 'date',
			validateDate: true
		},
		toVideoTime: {
			type: 'date',
			validateDate: true
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
		boundingShapeType: {
			type: 'string',
			enum: ['polygon']
		},
		boundingShapeCoordinates: {
			type: 'array',
			isCoordinatesArray: true
		}
	},

	types: {
		isCoordinatesArray: coordinatesValidator
	}
};
