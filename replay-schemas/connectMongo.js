var mongoose = require('mongoose'),
	Promise = require('bluebird');

mongoose.Promise = Promise;

module.exports = function(host, port, database) {
	return new Promise(function(resolve, reject) {
		var host = host || 'localhost';
		var port = port || 27017;
		var database = database || 'replay_dev';

		console.log('Conencting to mongo...', ' Database: ', database, '. URI: ', host + ':' + port + '.');

		var keepAliveInSeconds = 60 * 60 * 24 * 30; // 30 days
		// initialize options
		var options = {
			server: {
				socketOptions: {
					keepAlive: keepAliveInSeconds
				}
			},
			replset: {
				socketOptions: {
					keepAlive: keepAliveInSeconds
				}
			}
		};

		var uri = 'mongodb://' + host + ':' + port + '/' + database;
		// connect to mongo
		mongoose.connect(uri, options);
		console.log('Connected to mongo.');
		resolve();
	});
}
