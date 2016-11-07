var s3 = require('s3'),
	Promise = require('bluebird');

const SERVICE_NAME = 'replay-aws-s3';
const MAX_SOCKETS = 20;

function getClient() {
	return s3.createClient({
		maxAsyncS3: 20, // default value
		s3RetryCount: 3, // default value
		s3RetryDelay: 1000, // default value
		multipartUploadThreshold: 20 * 1024 * 1024, // default value (20 MB)
		multipartUploadSize: 15 * 1024 * 1024, // default value (15 MB)
		s3Options: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
				// any other options are passed to new AWS.S3()
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
		}
	});
}

module.exports.getClient = function() {
	return getClient();
};

module.exports.uploadFile = function(filePath, bucket, key) {
	return new Promise(function(resolve, reject) {
		var params = {
			localFile: filePath,
			defaultContentType: 'application/octet-stream', // default value
			s3Params: {
				Bucket: bucket,
				Key: key
					// other options supported by putObject, except Body and ContentLength.
					// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			}
		};
		var client = getClient();
		var uploader = client.uploadFile(params);
		uploader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to upload:', err.stack);
			reject(err);
		});
		uploader.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
		});
		uploader.on('end', function() {
			console.log(SERVICE_NAME, '- done uploading');
			resolve();
		});
	});
};

module.exports.downloadFile = function(filePath, bucket, key) {
	return new Promise(function(resolve, reject) {
		var params = {
			localFile: filePath,
			s3Params: {
				Bucket: bucket,
				Key: key
					// other options supported by putObject, except Body and ContentLength.
					// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			}
		};
		var client = getClient();
		var downloader = client.downloadFile(params);
		downloader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to download:', err.stack);
			reject(err);
		});
		downloader.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', downloader.progressAmount, downloader.progressTotal);
		});
		downloader.on('end', function() {
			console.log(SERVICE_NAME, '- done downloading');
			resolve();
		});
	});
};

module.exports.deleteObjects = function(bucket, objects) {
	// var objects = [{
	// 		Key: 'STRING_VALUE',
	// 		VersionId: 'STRING_VALUE'
	// 	}, {
	// 		Key: 'STRING_VALUE',
	// 		VersionId: 'STRING_VALUE'
	// 	},
	// 	/* more items */
	// ]
	return new Promise(function(resolve, reject) {
		var params = {
			Bucket: bucket,
			Delete: {
				Objects: objects,
				Quiet: true
			}
		};

		var client = getClient();
		var deleter = client.deleteObjects(params);
		deleter.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to delete:', err.stack);
			reject(err);
		});
		deleter.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', deleter.progressAmount, deleter.progressTotal);
		});
		deleter.on('end', function() {
			console.log(SERVICE_NAME, '- done delete');
			resolve();
		});
	});
};

module.exports.uploadDir = function(dirPath, bucket, key) {
	return new Promise(function(resolve, reject) {
		require('http').globalAgent.maxSockets = MAX_SOCKETS;
		require('https').globalAgent.maxSockets = MAX_SOCKETS;

		function getMimeType(file) {
			// just an example
			return 'video/mp4';
		}

		function getS3Params(localFile, stat, callback) {
			var err = new Error('some error info'); // only if there is an error
			var s3Params = {
				ContentType: getMimeType(localFile) // just an example
			};
			callback(err, s3Params); // pass `null` for `s3Params` if you want to skip uploading this file
		}

		var params = {
			localDir: dirPath,
			getS3Params: getS3Params,
			defaultContentType: 'application/octet-stream', // default value
			deleteRemoved: false, // default value, whether to remove s3 objects that have no corresponding local file
			followSymlinks: true, // default value, whether to ignore symlinks
			s3Params: {
				Bucket: bucket,
				Prefix: key
					// other options supported by putObject, except Body and ContentLength.
					// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			}
		};
		var client = getClient();
		var uploader = client.uploadDir(params);
		uploader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to upload:', err.stack);
			reject(err);
		});
		uploader.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', uploader.progressAmount, uploader.progressTotal);
		});
		uploader.on('end', function() {
			console.log(SERVICE_NAME, '- done uploading');
			resolve();
		});
	});
};

module.exports.downloadDir = function(dirPath, bucket, key) {
	return new Promise(function(resolve, reject) {
		require('http').globalAgent.maxSockets = MAX_SOCKETS;
		require('https').globalAgent.maxSockets = MAX_SOCKETS;

		function getS3Params(localFile, s3Object, callback) {
			// localFile is the destination path where the object will be written to
			// s3Object is same as one element in the `Contents` array from here:
			// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property

			// call callback like this:
			var err = new Error('some error info'); // only if there is an error
			var s3Params = {
				VersionId: 'abcd' // just an example
			};
			callback(err, s3Params); // pass `null` for `s3Params` if you want to skip downloading this object
		}

		var params = {
			localDir: dirPath,
			getS3Params: getS3Params,
			deleteRemoved: false, // default value, whether to remove s3 objects that have no corresponding local file
			followSymlinks: true, // default value, whether to ignore symlinks
			s3Params: {
				Bucket: bucket,
				Prefix: key
					// other options supported by putObject, except Body and ContentLength.
					// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			}
		};
		var client = getClient();
		var downloader = client.downloadDir(params);
		downloader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to download:', err.stack);
			reject(err);
		});
		downloader.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', downloader.progressAmount, downloader.progressTotal);
		});
		downloader.on('end', function() {
			console.log(SERVICE_NAME, '- done downloading');
			resolve();
		});
	});
};

module.exports.deleteObjects = function(bucket, key) {
	return new Promise(function(resolve, reject) {
		var params = {
			Bucket: bucket,
			Prefix: key
		};

		var client = getClient();
		var deleter = client.deleteDir(params);
		deleter.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to delete:', err.stack);
			reject(err);
		});
		deleter.on('progress', function() {
			console.log(SERVICE_NAME, '- progress', deleter.progressAmount, deleter.progressTotal);
		});
		deleter.on('end', function() {
			console.log(SERVICE_NAME, '- done delete');
			resolve();
		});
	});
};
