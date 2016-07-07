var nestedValidator = require('./services/nested-model-validator');

var Video = {

	identity: 'video',
	connection: 'mongo',
	schema: true,

	attributes: {
		sourceId: {
			type: 'string',
			required: true
		},
		provider: {
			type: 'string',
			enum: ['kaltura']
		},
		providerId: {
			type: 'string'
		},
		relativePath: {
			type: 'string',
			required: true
		},
		providerData: {
			type: 'json'
		},
		name: {
			type: 'string',
			required: true
		},
		receivingMethod: {
			model: 'receivingmethod'
		},
		status: {
			type: 'string',
			enum: ['processing', 'ready'],
			defaultsTo: 'processing'
		}
	}
};

module.exports = Video;
