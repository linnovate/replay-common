var elasticsearch = require('elasticsearch'),
	Promise = require('bluebird');

var _client;

// connect to ElasticSearch once so the service won't have to re-create connection each time
module.exports.connect = function(_host, _port) {
	var host = _host || 'localhost';
	var port = _port || 9200;

	var uri = host + ':' + port;
	// connect to elastic
	// keep-alive is true by default, which means forever
	_client = new elasticsearch.Client({
		host: uri,
		log: ['error', 'warning'],
		apiVersion: '2.3',
		sniffOnConnectionFault: true,
		deadTimeout: 10 * 1000,
		maxRetries: 10,
		defer: function() {
			return Promise.defer();
		}
	});
};

module.exports.searchVideoMetadata = function(polygon) {
	var body = {
		query: {
			geo_shape: {
				sensorTrace: {
					relation: 'intersects',
					shape: {
						type: 'Polygon',
						coordinates: polygon
					}
				}
			}
		}
	};
	var query = {
		index: 'videometadatas',
		type: 'videometadata',
		body: body
	};

	return _client.search(query);
};

module.exports.getDataByName = function(index, type, name, sort, callback) {
	var body = {
		query: {
			term: { videoId: name }
		}
	};

	_client.search(index, type, body, sort, function(resp) {
		callback(resp.hits.hits);
	});
};

module.exports.getDataByAll = function(index, type, termsArray, startTime, endTime, polygon, relation, callback) {
	var body = {
		filter: {
			bool: {
				must: {}
			}
		}
	};

	if (polygon !== null) {
		var squery = {
			geo_shape: {
				sensorTrace: {
					relation: relation,
					shape: {
						type: 'polygon',
						coordinates: [
							[]
						]
					}
				}
			}
		};
		var i = 0;

		polygon.forEach(function(r) {
			squery.geo_shape.sensorTrace.shape.coordinates[0][i] = r;
			i++;
		});

		termsArray.push(squery);
	}

	if (startTime !== null) {
		var tquery = {};
		tquery.range = {};
		tquery.range.timestamp = {};
		tquery.range.timestamp.gte = startTime;
		if (endTime === null) {
			var now = new Date();

			console.log(now);
			endTime = now.toISOString();
		}
		console.log(startTime, endTime);
		tquery.range.timestamp.lte = endTime;
		termsArray.push(tquery);
	}

	body.filter.bool.must = termsArray;
	_client.search(index, type, body, null, function(resp) {
		callback(resp.hits.hits);
	});
};

module.exports.bulkInsertVideoMetadatas = function(videoMetadatas) {
	// convert xmls to bulk request object for elastic
	var bulkRequest = videoMetadatasToElasticBulkRequest(videoMetadatas);

	return _client.bulk({
		body: bulkRequest
	});
};

function videoMetadatasToElasticBulkRequest(videoMetadatas) {
	var bulkRequest = [];

	videoMetadatas.forEach(function(videoMetadata) {
		// efficient way to remove auto generated _id
		videoMetadata._id = undefined;

		// push action
		bulkRequest.push({
			index: {
				_index: 'videometadatas',
				_type: 'videometadata'
			}
		});

		// push document
		bulkRequest.push(videoMetadata);
	});

	return bulkRequest;
}
