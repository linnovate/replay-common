var Waterline = require('waterline'),
	mongoAdapter = require('sails-mongo');

var Video = require('./Video'),
	VideoMetadata = require('./VideoMetadata'),
	ReceivingMethod = require('./nested-schemas/ReceivingMethod'),
	Coordinate = require('./nested-schemas/Coordinate'),
	GeoJson = require('./nested-schemas/GeoJson');

// the duration in seconds to keep alive the connection with mongo

var mongoKeepAliveInSeconds = 60 * 60 * 24 * 30; // 30 days

module.exports = function() {
	console.log('Initializing waterline...');

	// instantiate a new instance of the ORM
	var orm = new Waterline();

	var config = {

		// setup Adapters
		// creates named adapters that have been required
		adapters: {
			mongo: mongoAdapter
		},

		// build connections config
		// setup connections using the named adapter configs
		connections: {
			mongo: {
				adapter: 'mongo',
				host: process.env.MONGO_HOST,
				port: process.env.MONGO_PORT,
				database: process.env.MONGO_DATABASE,
				server: {
					socketOptions: {
						keepAlive: mongoKeepAliveInSeconds
					}
				},
				replSet: {
					socketOptions: {
						keepAlive: mongoKeepAliveInSeconds
					}
				}
			}
		},

		defaults: {
			migrate: 'alter'
		}

	};

	// load waterline models

	orm.loadCollection(Video);
	orm.loadCollection(VideoMetadata);
	orm.loadCollection(ReceivingMethod);
	orm.loadCollection(Coordinate);
	orm.loadCollection(GeoJson);

	orm.initialize(config, function(err, models) {
		if (err) {
			throw err;
		}
		// set models global object so it will be accessible everywhere
		global.models = models.collections;

		console.log('Waterline initialization finished.');
	});
};