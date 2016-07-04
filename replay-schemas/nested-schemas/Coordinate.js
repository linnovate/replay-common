var Waterline = require('waterline');

var Position = Waterline.Collection.extend({

	identity: 'coordinate',
	connection: 'mongo',
	schema: true,

	attributes: {
		lat: {
			type: 'float',
			required: true
		},
		lon: {
			type: 'float',
			required: true
		}
	}
});

module.exports = Position;
