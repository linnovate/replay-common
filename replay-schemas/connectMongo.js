var mongoose = require('mongoose'),
	Promise = require('bluebird');

mongoose.Promise = Promise;

module.exports = function(){
	return new Promise(function(resolve, reject){
		var host = process.env.MONGO_HOST || 'localhost';
		var port = process.env.MONGO_PORT || 27017;

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

		var uri = 'mongodb://' + host + ':' + port + '/' + process.env.MONGO_DATABASE;
		// connect to mongo
		mongoose.connect(uri, options);
		console.log('Connected to mongo.');
		resolve();
	});
}
