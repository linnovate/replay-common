var path = require('path'),
	util = require('util');

var bunyan = require('bunyan');

var streamFactory = require('./stream-factory'),
	errorHandler = require('./error-handler.js');

var Logger = function(serviceName) {
	const LOG_PATH = process.env.LOG_PATH || path.join(process.env.HOME, 'replay-logs');

	function getDevStreams() {
		return [
			streamFactory.formatRawStream('trace'),
			streamFactory.syslogStream('trace'),
			streamFactory.rotatingFileStream('trace', serviceName, LOG_PATH)
		];
	}

	function getTestStreams() {
		return [
			streamFactory.formatRawStream('error')
		];
	}

	function getProdStreams() {
		return [
			streamFactory.formatRawStream('trace'),
			streamFactory.syslogStream('trace'),
			streamFactory.rotatingFileStream('trace', serviceName, LOG_PATH)
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
				errorHandler(new Error(util.format('Unknown node environment, NODE_ENV = %s. (Using default env: %s)', nodeEnv, 'dev')));
				return getDevStreams(); // by default return dev streams
		}
	}

	function needSrc(nodeEnv) {
		switch (nodeEnv) {
			case 'dev':
			case 'development':
			case 'debug':
			case 'debugging':
			case 'test':
			case 'testing':
				return true;
			case 'stage':
			case 'staging':
			case 'prod':
			case 'production':
				return false;
			default:
				return true;
		}
	}

	function getSerializers(nodeEnv) {
		return {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
			err: bunyan.stdSerializers.err
		};
	}

	var bunyanLogger = bunyan.createLogger({
		name: serviceName,
		src: needSrc(process.env.NODE_ENV),
		streams: getStreams(process.env.NODE_ENV),
		serializers: getSerializers(process.env.NODE_ENV)
	});

	bunyanLogger.on('error', function(err, stream) {
		errorHandler(err);
	});

	return bunyanLogger;
};

module.exports = Logger;
