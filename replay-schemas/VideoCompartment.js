require('mongoose-geojson-schema');
var xml2js = require('xml2js');
var Promise = require('bluebird');
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var VideoCompartmentSchema = new Schema({
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	classificationId: {
		type: Schema.Types.ObjectId,
		ref: 'Classification'
	},
	boundingPolygon: mongoose.Schema.Types.GeoJSON,
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		validate: validateGreaterThanStartTime,
		required: true
	},
	startAsset: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	destination: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

var VideoCompartment = mongoose.model('VideoCompartment', VideoCompartmentSchema);

module.exports = {
	VideoCompartment: VideoCompartment,
	generateCompartmentCondition: function(userCode) {
		return getUserPermissions(userCode)
			.then(parseXml)
			.then(buildQuery);
	}
};

function buildQuery(permissions) {
	return new Promise(function(resolve, reject) {
		try {
			var query = { $or: [] };
			for (i = 0; i < permissions.length; i++) {
				query.$or.push({
					destination: permissions[i].id[0]
				});
				if (i === permissions.length - 1) {
					console.log('query: ' + JSON.stringify(query));
					resolve(query);
					break;
				}
			}
		} catch (err) {
			reject(err);
		}
	});
}

function validateGreaterThanStartTime(obj) {
	if (obj.startTime <= obj.endTime) {
		return false;
	}

	return true;
}

function getUserPermissions(userCode) {
	var PromiseRequest = Promise.method(function(options) {
		return new Promise(function(resolve, reject) {
			var request = http.request(options, function(response) {
				// Bundle the result
				response.setEncoding('utf8');
				var responseString = '';

				response.on('data', function(data) {
					responseString += data;
				});

				response.on('end', function() {
					resolve(responseString);
				});
			});

			// Handle errors
			request.on('error', function(error) {
				console.log('Problem with request:', error.message);
				reject(error);
			});

			request.end();
		});
	});

	return PromiseRequest({
		host: process.env.COMPARTMENT_HOST || 'localhost', //
		port: process.env.COMPARTMENT_PORT || 1337, //
		path: '/compartment/getCompartment',
		method: 'GET'
	});
}

function parseXml(data) {
	var parser = new xml2js.Parser();
	return new Promise(function(resolve, reject) {
		parser.parseString(data, function(err, result) {
			if (result === undefined || err) {
				reject(err);
			} else {
				var permissions = result.permissions.allow[0].userPermission;
				resolve(permissions);
			}
		});
	});
}
