var path = require('path'),
	util = require('util');

var clone = require('clone'),
	moment = require('moment'),
	mkdirp = require('mkdirp'),
	bunyan = require('bunyan'),
	stripAnsi = require('strip-ansi'),
	bunyanSyslog = require('bunyan-syslog'),
	bunyanFormat = require('bunyan-format'),
	RotatingFileStream = require('bunyan-rotating-file-stream');

var EventEmitter = require('events').EventEmitter;

function bunyanFormatStream(outStream) {
	return bunyanFormat({
		outputMode: 'long',
		// levelInString: true
		// color:true,
		colorFromLevel: {
			10: 'white',
			20: 'yellow',
			30: 'cyan',
			40: 'magenta',
			50: 'red',
			60: 'inverse'
		}
	}, outStream);
}

function MyStripColorsStream(outStream) {
	this.outStream = outStream;
	this.write = function(rec) {
		this.outStream.write(stripAnsi(rec));
	};
}

function MyRawStream(outStream) {
	this.outStream = outStream;
}
util.inherits(MyRawStream, EventEmitter);

MyRawStream.prototype.write = function(rec) {
	if (typeof rec === 'object' && rec !== null) {
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

		this.outStream.write(JSON.stringify(newRec, bunyan.safeCycles()));
	} else {
		this.emit('error', new Error(util.format('Logger raw stream got a non-object record: %j', rec)));
	}
};

exports.formatRawStream = function(level) {
	var outStream = bunyanFormatStream();
	return {
		type: 'raw',
		name: 'formatRawStream',
		level: level,
		reemitErrorEvents: true,
		stream: new MyRawStream(outStream)
	};
};

exports.rotatingFileStream = function(level, serviceName, logPath) {
	mkdirp.sync(path.join(logPath, serviceName));
	var rotatingFileStream = new RotatingFileStream({
		path: path.join(logPath, serviceName, 'replay.%d-%b-%y.%N.log'),
		period: '1d', // daily rotation
		threshold: '10m', // rotate log files larger than 10 megabytes
		totalSize: '20m', // don't keep more than 20mb of archived log files
		totalFiles: 10, // keep 10 back copies
		// fieldOrder: ['time'], // write 'time' field first (on the left of each row) for each log entry in the file
		// startNewFile: true, // force the stream to create a new file on startup
		rotateExisting: true, // give ourselves a clean file when we start up, based on period
		gzip: true // compress the archive log files to save space
	});
	// var outStream = bunyanFormatStream(new MyStripColorsStream(rotatingFileStream));
	return {
		type: 'raw',
		name: 'rotatingFileStream',
		level: level,
		reemitErrorEvents: true,
		stream: rotatingFileStream
	};
};

exports.syslogStream = function(level) {
	var bunyanSyslogStream = bunyanSyslog.createBunyanStream({
		type: 'sys',
		facility: bunyanSyslog.local0
		// host: '192.168.0.1',
		// port: 514
	});
	var outStream = bunyanFormatStream(new MyStripColorsStream(bunyanSyslogStream));
	return {
		type: 'raw',
		name: 'syslogStream',
		level: level,
		reemitErrorEvents: true,
		stream: new MyRawStream(outStream)
	};
};
