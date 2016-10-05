var path = require('path'),
	util = require('util');

var chalk = require('chalk'),
	moment = require('moment'),
	bunyan = require('bunyan');

var streamFactory = require('./stream-factory');

// chalk.enabled = true;

const LOG_PATH = process.env.LOG_PATH || path.join(process.env.HOME, 'replay-logs');

function replayLoggerError(err) {
	var ctx = new chalk.constructor({ enabled: true });

	console.error('[%s] %s: %s \n%s',
		moment().format('dddd, MMMM Do YYYY, HH:mm:ss.SSS'),
		ctx.red('REPLAY-LOGGER ERROR'),
		ctx.cyan(err.message),
		err.stack);
}

var Logger = function(serviceName) {
	function getDevStreams() {
		return [
			streamFactory.rotatingFileStream(serviceName, 'trace', LOG_PATH),
			streamFactory.formatRawStream('devFormatRawStream', 'trace')
		];
	}

	function getTestStreams() {
		return [
			streamFactory.formatRawStream('testFormatRawStream', 'error')
		];
	}

	function getProdStreams() {
		return [
			streamFactory.rotatingFileStream(serviceName, 'trace', LOG_PATH)
		];
	}

	function getStreams(nodeEnv) {
		switch (nodeEnv) {
			case 'dev':
			case 'development':
			case 'debug':
			case 'debugging':
				return getDevStreams();
			case 'test':
			case 'testing':
				return getTestStreams();
			case 'stage':
			case 'staging':
				return getProdStreams();
			case 'prod':
			case 'production':
				return getProdStreams();
			default:
				replayLoggerError(new Error(util.format('Unknown node environment, NODE_ENV = %s. (Using default env: %s)', nodeEnv, 'dev')));
				return getDevStreams(); // by default return dev streams
		}
	}

	var bunyanLogger = bunyan.createLogger({
		name: serviceName,
		src: true,
		streams: getStreams(process.env.NODE_ENV),
		serializers: {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
			err: bunyan.stdSerializers.err
		}
	});

	bunyanLogger.on('error', function(err, stream) {
		replayLoggerError(err);
	});

	return bunyanLogger;
};

module.exports = Logger;
