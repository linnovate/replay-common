var nestedValidator = require('./services/nested-model-validator'),
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
		boundingPolygon: {
			model: 'geojson'
		}
	},

	types: {
		validateDate: function(obj) {
			return _.isDate(obj);
		}
	}
};
