var Waterline = require('waterline'),
	_ = require('lodash');

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
		// should be [[[lon,lat],[lon,lat],...]]
		coordinates: {
			type: 'array',
			isCoordinatesArray: true,
			required: true
		}
	},

	types: {
		isCoordinatesArray: function(obj) {
			if(this.type === 'polygon'){
				// check first []
				if(obj.length != 1)
					return false;

				var coordinates = obj[0];

				// polygon array should have at least 3(+1) coordinates
				if (coordinates.length < 4) {
					return false;
				}

				// iterate through the array and validate each object is indeed coordinates array
				coordinates.forEach(function(coordinate) {
					if (coordinate.length !== 2 || !_.isFinite(coordinate[0]) || !_.isFinite(coordinate[1])) {
						return false;
					}
				});

				// validate first and last coordinates are equal
				if(coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
					coordinates[0][1] !== coordinates[coordinates.length - 1][1]){
					return false;
				}
			}
			return true;
		}
	}
});

module.exports = GeoJson;
