var Waterline = require('waterline');

var GeoJson = Waterline.Collection.extend({

	identity: 'geojson',
	connection: 'mongo',
	schema: true,

	attributes: {
		type: {
			type: 'string',
			enum: ['polygon'],
			required: true
		},
		// should be [[lon,lat]]
		coordinates: {
			type: 'array',
			isCoordinatesArray: true,
			required: true
		}
	},

	types: {
		isCoordinatesArray: function(obj) {
			// polygon array should have at least 3 coordinates
			if (obj.length < 3) {
				return false;
			}

			// iterate through the array and validate each object is indeed coordinates array
			obj.forEach(function(coordinate) {
				if (coordinate.length !== 2 || typeof coordinate[0] !== 'number' ||
					typeof coordinate[1] !== 'number') {
					return false;
				}
			});

			return true;
		}
	}
});

module.exports = GeoJson;
