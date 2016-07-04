var Waterline = require('waterline'),
	nestedValidator = require('./services/nested-model-validator');

var Video = Waterline.Collection.extend({

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
			type: 'json',
			validateReceivingMethod: true
		},
		status: {
			type: 'string',
			enum: ['processing', 'ready'],
			defaultsTo: 'processing'
		}
	},

	types: {
		validateReceivingMethod: function(obj) {
			console.log('Validating ReceivingMethod...');
			return nestedValidator(global.models.receivingmethod, obj);
		}
	}
});

module.exports = Video;
