// Requires
var ffmpeg = require('fluent-ffmpeg'),
	BluebirdPromise = require('bluebird');
var event = require('events').EventEmitter,
	util = require('util');

const SERVICE_NAME = '#FFmpegWrapper#';

var Ffmpeg = function() {
	var self = this;
	// Params object (e.g{inputs:<[inputs]>,Directory:<dir/dir2>,file:<filename>,duration:<sec/hh:mm:ss.xxx>})
	self.captureMuxedVideoTelemetry = function(params) {
		// setting the boolean requests to check params
		var checkBadParams = (!params.duration || !params.file || !params.dir || !params.inputs || params.inputs.length === 0);
		if (checkBadParams) {
			return BluebirdPromise.reject('bad params suplied');
		}
		console.log(SERVICE_NAME, 'capturing muxed!!!!!');
		// Building the FFmpeg command
		var builder = new BluebirdPromise(function(resolve, reject) {
			// FFmpeg command initialization
			var command = ffmpeg();
			// Resolving the command forward
			resolve(command);
		});

		// Start building command
		builder
			.then(function(command) {
				return initializeInputs(command, params);
			})
			.then(function(command) {
				return videoOutput(command, params);
			})
			.then(function(command) {
				return extractData(command, params);
			})
			.then(function(command) {
				return setEvents(command, params);
			})
			.then(function(command) {
				return runCommand(command);
			})
			.catch(function(err) {
				self.emit('FFmpegError', err);
			});

		return builder;
	};

	self.captureVideoWithoutTelemetry = function(params) {
		// setting the boolean requests to check params
		var checkBadParams = (!params.duration || !params.file || !params.dir || !params.inputs || params.inputs.length === 0);
		if (checkBadParams) {
			return BluebirdPromise.reject('bad params suplied');
		}
		// Building the FFmpeg command
		var builder = new BluebirdPromise(function(resolve, reject) {
			// FFmpeg command initialization
			var command = ffmpeg();
			// Resolving the command forward
			resolve(command);
		});

		// Start building command
		builder
			.then(function(command) {
				return initializeInputs(command, params);
			})
			.then(function(command) {
				return videoOutput(command, params);
			})
			.then(function(command) {
				return setEvents(command, params);
			})
			.then(function(command) {
				return runCommand(command);
			})
			.catch(function(err) {
				self.emit('FFmpegError', err);
			});

		return builder;
	};

	self.captureTelemetryWithoutVideo = function(params) {
		// setting the boolean requests to check params
		var checkBadParams = (!params.duration || !params.file || !params.dir || !params.inputs || params.inputs.length === 0);
		if (checkBadParams) {
			return BluebirdPromise.reject('bad params suplied');
		}
		// Building the FFmpeg command
		var builder = new BluebirdPromise(function(resolve, reject) {
			// FFmpeg command initialization
			var command = ffmpeg();
			// Resolving the command forward
			resolve(command);
		});

		// Start building command
		builder
			.then(function(command) {
				return initializeInputs(command, params);
			})
			.then(function(command) {
				return extractData(command, params);
			})
			.then(function(command) {
				return setEvents(command, params);
			})
			.then(function(command) {
				return runCommand(command);
			})
			.catch(function(err) {
				self.emit('FFmpegError', err);
			});

		return builder;
	};

	/*********************************************************************************************************
	 *
	 *	@author din
	 *
	 *	Convert the mpegts format video to mp4 format video
	 *	@params {object} contain the file path[filePath].
	 *	@return Promise when finished the preparing/unexcepted error eccured while preparing the converting.
	 *
	 *	@emit 'FFmpegWrapper_errorOnConverting' when error eccured on converting.
	 *	@emit 'FFmpegWrapper_finishConverting' when finish the converting.
	 *
	 *********************************************************************************************************/
	self.convertMpegTsFormatToMp4 = function(params) {
		var builder = new BluebirdPromise(function(resolve, reject) {
			var command = ffmpeg();
			resolve(command);
		});

		builder
			.then(function(command) {
				// Get the file path and change the suffix of the path e.g /my/path/file.ts --> /my/path/file.mp4
				var newFilePath = params.filePath.replace('.ts', '.mp4');

				console.log(SERVICE_NAME, 'converting the file:', params.filePath, 'to:', newFilePath);

				command
				// define the input.
					.input(params.filePath)
					// define the output.
					.output(newFilePath)
					// force the ffmpeg to override file with the same name.
					.outputOptions(['-y'])
					// force the ffmpeg to convert the video to mp4 format.
					.format('mp4')
					.on('start', function(commandLine) {
						console.log(SERVICE_NAME, 'convert the file with the command:\n', commandLine);
					})
					// when any error happen when the ffmpeg process run.
					.on('error', function(err) {
						self.emit('FFmpegWrapper_errorOnConverting', err);
					})
					// when ffmpeg process done his job.
					.on('end', function() {
						self.emit('FFmpegWrapper_finishConverting', newFilePath, params.filePath, params.startTime);
					})
					.run();
				return BluebirdPromise.resolve(command);
			})
			.catch(function(err) {
				return BluebirdPromise.reject(err);
			});

		return builder;
	};

	/*********************************************************************************************************
	 *
	 *	@author din
	 *
	 *	Get the duration of given video.
	 *	@params {object} contain the file path[filePath].
	 *	@return Promise with the duration/error.
	 *
	 *********************************************************************************************************/
	self.getDurationOfVideo = function(params) {
		var promise = new BluebirdPromise(function(resolve, reject) {
			ffmpeg.ffprobe(params.filePath, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data.format.duration);
				}
			});
		});

		return promise;
	};

	/*********************************************************************************************************
	 *
	 *	@author din
	 *
	 *	record the stream into ts file.
	 *	@params {object} contain the parameters.
	 *	@params.input {string} contain the input for the recording.
	 *	@params.duration {number} contain the durtion of the record, default to half hour(1800 Seconds).
	 *	@params.output {string} contain the output path that will saved in the file system (witout suffix e.g .ts, .mp4 etc).
	 *
	 *	@emit "ffmpegWrapper_finish_recording" when the record finished, pass the path of the record file.
	 *	@emit "ffmpegWrapper_error_while_recording" when error eccured, pass the error.
	 *
	 *	@return Promise that the command execute.
	 *
	 *********************************************************************************************************/
	self.record = function(params) {
		// init variables.
		var input, output, duration, command;
		var promise = new Promise(function(resolve, reject) {
			// validate the parameters.
			if (!_validateRecordParameters(params)) {
				return reject('parameters are missing');
			}
			input = params.input;
			output = params.output + '.tmp';
			duration = (params.duration && typeof params.duration !== 'string' && params.duration > 0) ? params.duration : 1800;
			return resolve(command);
		});

		promise
			.then(function(command) {
				// init new ffmpeg command.
				command = ffmpeg();
				// define the ffmpeg command with input,output and duration.
				command
					.input(input)
					.output(output)
					.duration(duration)
					.format('mpegts');
				return Promise.resolve(command);
			})
			.then(function(command) {
				// init events for the ffmpeg command.
				command
					.on('start', function(commandLine) {
						console.log(SERVICE_NAME, 'start record with the command:\n', commandLine);
					})
					.on('error', function(err) {
						self.emit('ffmpegWrapper_error_while_recording', err);
					})
					.on('end', function() {
						self.emit('ffmpegWrapper_finish_recording', output);
					})
					// running the command.
					.run();
				return Promise.resolve(command);
			})
			.catch(function(err) {
				self.emit('ffmpegWrapper_error_while_recording', err);
			});

		return promise;
	};

	// validate the necessary prameters.
	function _validateRecordParameters(params) {
		return (params && params.input && params.output);
	}

	// Set events
	function setEvents(command, params) {
		var videoPath = params.dir + '/' + params.file + '.ts';
		var telemetryPath = params.dir + '/' + params.file + '.data';
		command
			.on('start', function(commandLine) {
				console.log(SERVICE_NAME, 'Spawned FFmpeg with command: ' + commandLine);
				// Initialize indicator for data started flowing
				self.emit('FFmpegBegin', { telemetryPath: telemetryPath, videoPath: videoPath });
				command.bytesCaptureBegan = false;
			})
			.on('progress', function(progress) {
				// Check if should notify for first bytes captured
				if (command.bytesCaptureBegan === false) {
					command.bytesCaptureBegan = true;
					self.emit('FFmpegFirstProgress', { telemetryPath: telemetryPath, videoPath: videoPath });
				}
			})
			.on('end', function() {
				console.log(SERVICE_NAME, 'Processing finished !');
				self.emit('FFmpegDone', { telemetryPath: telemetryPath, videoPath: videoPath });
			})
			.on('error', function(err) {
				self.emit('FFmpegError', 'Error on FFmpegWrapper : ' + err);
			});
		return command;
	}
	// Start the ffmpeg process
	function runCommand(command) {
		command.run();
		return command;
	}

	// Initialize inputs
	function initializeInputs(command, params) {
		params.inputs.forEach(function(value) {
			command.input(value);
		});
		return command;
	}

	// Define a origin video output
	function videoOutput(command, params) {
		command.output(params.dir + '/' + params.file + '.ts')
			.outputOptions(['-y'])
			.duration(params.duration)
			.format('mpegts');
		return command;
	}

	// Extracting binary data from stream
	function extractData(command, params) {
		command.output(params.dir + '/' + params.file + '.data')
			.duration(params.duration)
			.outputOptions(['-map data-re', '-codec copy', '-f data', '-y']);
		return command;
	}

	/*********************************************************************************

								functions for resolutions

	**********************************************************************************/

	// Define a 360p video output

	/* function videoOutput360p(command, params) {
		command.output(params.dir + '/' + params.file + '_320p.mp4')
			.duration(params.duration)
			.outputOptions(['-y'])
			.format('mp4')
			.size('480x360');
		return command;
	}*/

	// Define a 480p video output

	/* function videoOutput480p(command, params) {
		command.output(params.dir + '/' + params.file + '_480p.mp4')
			.duration(params.duration)
			.outputOptions(['-y'])
			.format('mp4')
			.size('640x480');
		return command;
	}*/
};

// Inhertis from the eventEmitter object
util.inherits(Ffmpeg, event);

// Export the module
module.exports = new Ffmpeg();
