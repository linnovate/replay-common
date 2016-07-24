var mongoose = require('mongoose'),
	_ = require('lodash');

var Schema = mongoose.Schema;

var GeoJson = new Schema({
	type: { type: String, enum: ['Polygon'] },
	coordinates: Schema.Types.Mixed // Geo-Json coordinates are [[[lon,lat]]]
});

module.exports = {
	type: GeoJson,
	validate: validateGeoJson
};

function validateGeoJson(obj) {
	if (obj.type === 'Polygon') {
		// check first []
		if (obj.coordinates.length !== 1) {
			return false;
		}

		var coordinates = obj.coordinates[0];

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
		if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
			coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
			return false;
		}
	}
	return true;
}
