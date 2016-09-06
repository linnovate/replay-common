// Core modules
var fs = require('fs'),
	path = require('path');
// NPM modules
var ffmpeg = require('fluent-ffmpeg'),
	xml2js = require('xml2js'),
	mkdirp = require('mkdirp'),
	Promise = require('bluebird');
// Local requiers
var smilElements = require('./smil-elements-objects');
// Instantiate new xml builder
var xmlBuilder = new xml2js.Builder();
// Smil generator object constractor
function SmilGenerator() {
	// function that generates smil xml and writes it to file
	this.generateSmil = function(params) {
		validateParams(params)
			.then(function() {
				// make sure there is no smil file already.
				try {
					fs.accessSync(path.join(params.folderPath, params.smilFileName), fs.F_OK);
					return Promise.resolve();
				} catch (err) {
					// create smil object
					return Promise.resolve(generateSmilObject(params));
				}
			})
			.then(function(smilXml) {
				// if there was no need to generate smil just resolve
				if (!smilXml) {
					return Promise.resolve();
				}
				// writes the smil generated into file
				return writeSmilFile(params.folderPath, params.smilFileName, smilXml);
			})
			.catch(function(err) {
				return Promise.reject(err);
			});
	};
	this.addVideos = function(mediaArray) {
		return Promise.resolve('to be impelmented...');
	};
	this.addAudio = function(mediaArray) {
		return Promise.resolve('to be impelmented...');
	};
	this.addSubtitles = function(mediaArray) {
		return Promise.resolve('to be impelmented...');
	};
}

// make usre all relevant params exists
function validateParams(params) {
	if ((!params.video && !params.audio && !params.subtitles) || !params.title || !params.folderPath || !params.smilFileName) {
		return Promise.reject('bad params supplied' + JSON.stringify(params));
	}
	return Promise.resolve();
}

// function that write to file..
function writeSmilFile(folderPath, smilFileName, xml) {
	return new Promise(function(resolve, reject) {
		checkAndCreatePath(folderPath);
		fs.writeFile(path.join(folderPath, smilFileName), xml, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

// function to make sure path exists
function checkAndCreatePath(path) {
	try {
		fs.accessSync(path, fs.F_OK);
	} catch (err) {
		mkdirp.sync(path);
	}
}

// function that generates smil object formated as xml
function generateSmilObject(params) {
	// init smil root xml element object
	var smilXmlFile = new smilElements.SmilNode(params.title);
	// make sure there is video is not array
	if (params.video && params.video.length > 0) {
		// generate videos xml elements for smil
		return handleVideosArrayObject(params.video, params.folderPath)
			.then(function(smilVideos) {
				smilXmlFile.smil.body.switch.video = smilVideos;
				return xmlBuilder.buildObject(smilXmlFile);
			});
	}
}

// creates video xml elements from video files
function handleVideosArrayObject(videos, folderPath) {
	return Promise.map(videos, function(video) {
		// retrive relevant metadata for video element
		return getVideoMetadata(folderPath, video)
			.catch(function(err) {
				return {};
			})
			.then(function(params) {
				// return a video xml element object
				return new smilElements.VideoNode(params);
			});
	});
}

// extract relevant metadata for video xml node to be represented in smil file
function extractRelevantData(video, metadata) {
	var relevantMetadata = {};
	if (metadata.streams) {
		var gotVideoStream = false,
			gotAudioStream = false;
		// for each stream in video asset extract relevant metadata
		metadata.streams.forEach(function(stream) {
			// catch only 1 video stream
			if (stream.codec_type === 'video' && gotVideoStream === false) {
				relevantMetadata.height = stream.height;
				relevantMetadata.width = stream.width;
				relevantMetadata.src = video;
				relevantMetadata.videoBitrate = stream.bit_rate;
				gotVideoStream = true;
				// catch the first audio stream
			} else if (stream.codec_type === 'audio' && gotAudioStream === false) {
				relevantMetadata.audioBitrate = stream.bit_rate;
				gotAudioStream = true;
			}
		});
	}
	return relevantMetadata;
}

// function that retrives video metadata form its file
function getVideoMetadata(folderPath, video) {
	return new Promise(function(resolve, reject) {
		// tool for retriving metadata of the video
		ffmpeg.ffprobe(path.join(folderPath, video), function(err, metadata) {
			if (err) {
				reject(err);
			} else {
				resolve(extractRelevantData(video, metadata));
			}
		});
	});
}

var smilGen = new SmilGenerator();
smilGen.generateSmil({
	folderPath: '/home/linnovate3/Downloads/BigBuckBunny',
	smilFileName: 'BigBuckBunny.smil',
	title: 'BigBuckBunny adaptive stream',
	video: ['BigBuckBunny_480p.mp4', 'BigBuckBunny_720p.mp4', 'BigBuckBunny_1080p.mp4']
});
