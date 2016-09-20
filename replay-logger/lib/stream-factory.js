var path = require('path'),
	util = require('util');

var moment = require('moment'),
	bunyan = require('bunyan'),
	bunyanLogstashTcp = require('bunyan-logstash-tcp');

var EventEmitter = require('events').EventEmitter;

function MyFormatRawStream() {}
util.inherits(MyFormatRawStream, EventEmitter);

MyFormatRawStream.prototype.write = function(rec) {
	if (typeof rec === 'object' && rec !== null) {
		// console.log('##########');
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
		this.emit('error', new Error(util.format('Logger raw stream got a non-object record: %j', rec)));
	}
};

exports.formatRawStream = function(name, level) {
	return {
		type: 'raw',
		stream: new MyFormatRawStream(),
		name: name,
		level: level,
		reemitErrorEvents: true
	};
};

exports.bunyanLogstashTcpStream = function(host, port, serviceName) {
	return bunyanLogstashTcp
		.createStream({
			host: '127.0.0.1',
			port: 9998,
			level: 'error',
			appName: 'Replay',
			tags: ['Replay', 'VOD', serviceName]
		})
		.on('connect', function() {
			console.log('Connect to tcp');
		}).on('close', function() {
			console.log('Closed connection to tcp');
		}).on('error', console.log);
};
