var Waterline = require('waterline');

var ReceivingMethod = Waterline.Collection.extend({

	identity: 'receivingmethod',
	connection: 'mongo',
	schema: true,

	attributes: {
		standard: {
			type: 'string',
			enum: ['VideoStandard', 'stanag'],
			required: true
		},
		version: {
			type: 'string',
			enum: ['0.9', '1.0', '4609'],
			required: true
		}
	}
});

module.exports = ReceivingMethod;
