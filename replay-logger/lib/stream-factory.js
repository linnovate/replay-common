var path = require('path'),
	util = require('util');

var clone = require('clone'),
	moment = require('moment'),
	mkdirp = require('mkdirp'),
	bunyan = require('bunyan'),
	bunyanLogstashTcp = require('bunyan-logstash-tcp'),
	RotatingFileStream = require('bunyan-rotating-file-stream');

var EventEmitter = require('events').EventEmitter;

function MyFormatRawStream() {}
util.inherits(MyFormatRawStream, EventEmitter);

MyFormatRawStream.prototype.write = function(rec) {
	if (typeof rec === 'object' && rec !== null) {
		// console.log('##########');
		// customize record fields:
		var newRec = clone(rec);

		newRec.name = rec.name;
		newRec.hostname = rec.hostname;
		newRec.pid = rec.pid;
		newRec.level = rec.level;
		newRec.msg = rec.msg;
		newRec.time = moment(rec.time).format('dddd, MMMM Do YYYY, HH:mm:ss.SSS');
		newRec.src = rec.src ? {
			file: path.basename(rec.src.file), // path.parse(rec.src.file).name,
			line: rec.src.line,
			func: rec.src.func
		} : rec.src;

		process.stdout.write(JSON.stringify(newRec, bunyan.safeCycles()) + '\n');
	} else {
		this.emit('error', new Error(util.format('Logger raw stream got a non-object record: %j', rec)));
	}
};

exports.formatRawStream = function(streamName, level) {
	return {
		type: 'raw',
		stream: new MyFormatRawStream(),
		name: streamName,
		level: level,
		reemitErrorEvents: true
	};
};

exports.bunyanLogstashTcpStream = function(serviceName, level, host, port) {
	return {
		type: 'raw',
		name: 'bunyanLogstashTcpStream',
		level: level,
		stream: bunyanLogstashTcp
			.createStream({
				host: host,
				port: port,
				level: level,
				appName: 'Replay',
				tags: ['Replay', 'VOD', serviceName]
			})
			.on('connect', function() {
				console.log('Connect to tcp');
			}).on('close', function() {
				console.log('Closed connection to tcp');
			}).on('error', console.log)
	};
};

exports.rotatingFileStream = function(serviceName, level, logPath) {
	mkdirp.sync(path.join(logPath, serviceName));

	return {
		type: 'raw',
		name: 'bunyanLogstashTcpStream',
		level: level,
		stream: new RotatingFileStream({
			path: path.join(logPath, serviceName, 'replay.%d-%b-%y.%N.log'),
			period: '1d', // daily rotation
			threshold: '10m', // Rotate log files larger than 10 megabytes
			totalSize: '20m', // Don't keep more than 20mb of archived log files
			totalFiles: 10, // keep 10 back copies
			// fieldOrder: ['time'], // Write 'time' field first (on the left of each row) for each log entry in the file
			startNewFile: true, // Force the stream to create a new file on startup
			rotateExisting: true, // Give ourselves a clean file when we start up, based on period
			gzip: true // Compress the archive log files to save space
		})
	};
};
