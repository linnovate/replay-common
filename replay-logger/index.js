var path = require('path'),
	util = require('util');

var bunyan = require('bunyan'),
	moment = require('moment'),
	chalk = require('chalk');

chalk.enabled = true;

var Logger = function(serviceName) {
	function MyFormatRawStream() {
		this.write = function(rec) {
			if (typeof rec === 'object' && rec !== null) {
				// customize record fields:
				rec.name = rec.name;
				rec.hostname = rec.hostname;
				rec.pid = rec.pid;
				rec.level = rec.level;
				rec.msg = rec.msg;
				rec.time = moment(rec.time).format('dddd, MMMM Do YYYY, HH:mm:ss.SSS');
				rec.src = rec.src ? {
					file: path.basename(rec.src.file), // path.parse(rec.src.file).name,
					line: rec.src.line,
					func: rec.src.func
				} : rec.src;
				rec.v = rec.v;

				process.stdout.write(JSON.stringify(rec, bunyan.safeCycles()) + '\n');
			} else {
				replayLoggerError(new Error(util.format('Logger raw stream got a non-object record: %j', rec)));
			}
		};
	}

	var _devStreams = [{
		type: 'raw',
		level: 'trace',
		name: 'devFormatRawStream',
		stream: new MyFormatRawStream()
	}];

	var _testStreams = [{
		type: 'raw',
		level: 'error',
		name: 'testFormatRawStream',
		stream: new MyFormatRawStream()
	}];

	var _prodStreams = [{
		type: 'raw',
		level: 'info',
		name: 'prodFormatRawStream',
		stream: new MyFormatRawStream()
	}];

	function getStreams(nodeEnv) {
		switch (nodeEnv) {
			case 'dev':
			case 'debug':
			case 'development':
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

	return _bunyanLogger;

	/*
		function trace(log) {
			var msg = log.message || log;
			_bunyanLogger.trace({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function debug(log) {
			var msg = log.message || log;
			_bunyanLogger.debug({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function info(log) {
			var msg = log.message || log;
			_bunyanLogger.info({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function warn(log) {
			var msg = log.message || log;
			_bunyanLogger.warn({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function error(log) {
			var msg = log.message || log;
			_bunyanLogger.error({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function fatal(log) {
			var msg = log.message || log;
			_bunyanLogger.fatal({ err: log, time: moment().format('MMMM Do YYYY, HH:mm:ss') }, msg);
		}

		function child(options, simple) {
			_bunyanLogger = _bunyanLogger.child(options, simple);
			return this;
		}

		return {
			trace: trace,
			debug: debug,
			info: info,
			warn: warn,
			error: error,
			fatal: fatal,
			child: child
		};
	*/
};

module.exports = Logger;

function replayLoggerError(err) {
	console.error('[%s] %s: %s \n%s',
		moment().format('dddd, MMMM Do YYYY, HH:mm:ss.SSS'),
		chalk.red('REPLAY-LOGGER ERROR'),
		chalk.cyan(err.message),
		err.stack);
}
