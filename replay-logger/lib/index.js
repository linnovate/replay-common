var util = require('util');

var chalk = require('chalk'),
	moment = require('moment'),
	bunyan = require('bunyan');

var streamFactory = require('./stream-factory');

// chalk.enabled = true;

function replayLoggerError(err) {
	var ctx = new chalk.constructor({ enabled: true });

	console.error('[%s] %s: %s \n%s',
		moment().format('dddd, MMMM Do YYYY, HH:mm:ss.SSS'),
		ctx.red('REPLAY-LOGGER ERROR'),
		ctx.cyan(err.message),
		err.stack);
}

var Logger = function(serviceName) {
	var _devStreams = [
		streamFactory.formatRawStream('devFormatRawStream', 'trace')
		//,	streamFactory.bunyanLogstashTcpStream(process.env.LOGSTASH_HOST, process.env.LOGSTASH_PORT, serviceName)
	];

	var _testStreams = [
		streamFactory.formatRawStream('testFormatRawStream', 'error')
	];

	var _prodStreams = [
		streamFactory.formatRawStream('prodFormatRawStream', 'info')
	];

	function getStreams(nodeEnv) {
		switch (nodeEnv) {
			case 'dev':
			case 'development':
			case 'debug':
			case 'debugging':
				return _devStreams;
			case 'test':
			case 'testing':
				return _testStreams;
			case 'stage':
			case 'staging':
				return _prodStreams;
			case 'prod':
			case 'production':
				return _prodStreams;
			default:
				// by default return dev streams
				replayLoggerError(new Error(util.format('Unknown node environment, NODE_ENV = %s. (Using default env: %s)', nodeEnv, 'dev')));
				return _devStreams;
		}
	}

	var _bunyanLogger = bunyan.createLogger({
		name: serviceName,
		src: true,
		streams: getStreams(process.env.NODE_ENV),
		serializers: {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
			err: bunyan.stdSerializers.err
		}
	});

	_bunyanLogger.on('error', function(err, stream) {
		replayLoggerError(err);
	});

	return _bunyanLogger;
};

module.exports = Logger;
