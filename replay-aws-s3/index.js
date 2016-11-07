var path = require('path');

var Promise = require('bluebird'),
	s3 = require('s3');

const SERVICE_NAME = 'replay-aws-s3';
const MAX_SOCKETS = process.env.MAX_SOCKETS || 20;

function getClient() {
	return s3.createClient({
		maxAsyncS3: 20, // default value
		s3RetryCount: 3, // default value
		s3RetryDelay: 1000, // default value
		multipartUploadThreshold: 20 * 1024 * 1024, // default value (20 MB)
		multipartUploadSize: 15 * 1024 * 1024, // default value (15 MB)
		s3Options: {
			// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.REGION
				// endpoint: 's3.yourdomain.com',
				// sslEnabled: false
		}
	});
}

module.exports.getClient = function() {
	return getClient();
};

module.exports.uploadFile = function(filePath, bucket, key) {
	return new Promise(function(resolve, reject) {
		var params = {
			localFile: resolvePath(filePath),
			defaultContentType: 'application/octet-stream', // default value
			s3Params: { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
				Bucket: bucket,
				Key: key
			}
		};
		var client = getClient();
		var uploader = client.uploadFile(params);
		uploader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to upload file:', err.stack);
			reject(err);
		});
		uploader.on('progress', function() {
			console.log(SERVICE_NAME, '- upload file progress:', uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
		});
		uploader.on('end', function(data) {
			console.log(SERVICE_NAME, '- done uploading file');
			resolve();
		});
	});
};

module.exports.downloadFile = function(filePath, bucket, key) {
	return new Promise(function(resolve, reject) {
		var params = {
			localFile: resolvePath(filePath),
			s3Params: { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
				Bucket: bucket,
				Key: key
			}
		};
		var client = getClient();
		var downloader = client.downloadFile(params);
		downloader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to download file:', err.stack);
			reject(err);
		});
		downloader.on('progress', function() {
			console.log(SERVICE_NAME, '- download file progress:', downloader.progressAmount, downloader.progressTotal);
		});
		downloader.on('end', function() {
			console.log(SERVICE_NAME, '- done downloading file');
			resolve();
		});
	});
};

module.exports.deleteObjects = function(bucket, objects) {
	// objects example:
	// var objects = [{
	// 		Key: 'STRING_VALUE',
	// 		VersionId: 'STRING_VALUE'
	// 	}, {
	// 		Key: 'STRING_VALUE',
	// 		VersionId: 'STRING_VALUE'
	// 	},
	// 	/* more items... */
	// ]
	return new Promise(function(resolve, reject) {
		var s3Params = { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
			Bucket: bucket,
			Delete: {
				Objects: objects,
				Quiet: true
			}
		};

		var client = getClient();
		var deleter = client.deleteObjects(s3Params);
		deleter.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to delete objects:', err.stack);
			reject(err);
		});
		deleter.on('progress', function() {
			console.log(SERVICE_NAME, '- delete objects progress:', deleter.progressAmount, deleter.progressTotal);
		});
		deleter.on('end', function() {
			console.log(SERVICE_NAME, '- done delete objects');
			resolve();
		});
	});
};

module.exports.uploadDir = function(dirPath, bucket, prefix) {
	return new Promise(function(resolve, reject) {
		require('http').globalAgent.maxSockets = MAX_SOCKETS;
		require('https').globalAgent.maxSockets = MAX_SOCKETS;

		function getMimeType(file) {
			return 'video/mp4'; // just an example
		}

		function getS3Params(localFile, stat, callback) {
			// call callback like this:
			var err = new Error('some error info'); // only if there is an error
			var s3Params = { // if there is no error
				ContentType: getMimeType(localFile) // just an example
			};
			callback(err, s3Params); // pass `null` for `s3Params` if you want to skip uploading this file
		}

		var params = {
			localDir: resolvePath(dirPath),
			getS3Params: getS3Params,
			defaultContentType: 'application/octet-stream', // default value
			deleteRemoved: false, // default value, whether to remove s3 objects that have no corresponding local file
			followSymlinks: true, // default value, whether to ignore symlinks
			s3Params: {
				Bucket: bucket,
				Prefix: prefix
			}
		};
		var client = getClient();
		var uploader = client.uploadDir(params);
		uploader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to upload dir:', err.stack);
			reject(err);
		});
		uploader.on('progress', function() {
			console.log(SERVICE_NAME, '- upload dir progress:', uploader.progressAmount, uploader.progressTotal);
		});
		uploader.on('end', function() {
			console.log(SERVICE_NAME, '- done uploading dir');
			resolve();
		});
	});
};

module.exports.downloadDir = function(dirPath, bucket, prefix) {
	return new Promise(function(resolve, reject) {
		require('http').globalAgent.maxSockets = MAX_SOCKETS;
		require('https').globalAgent.maxSockets = MAX_SOCKETS;

		function getS3Params(localFile, s3Object, callback) {
			// localFile is the destination path where the object will be written to
			// s3Object is same as one element in the `Contents` array from here:
			// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property

			// call callback like this:
			var err = new Error('some error info'); // only if there is an error
			var s3Params = { // if there is no error
				VersionId: 'abcd' // just an example
			};
			callback(err, s3Params); // pass `null` for `s3Params` if you want to skip downloading this object
		}

		var params = {
			localDir: resolvePath(dirPath),
			getS3Params: getS3Params,
			deleteRemoved: false, // default value, whether to remove s3 objects that have no corresponding local file
			followSymlinks: true, // default value, whether to ignore symlinks
			s3Params: {
				Bucket: bucket,
				Prefix: prefix
			}
		};
		var client = getClient();
		var downloader = client.downloadDir(params);
		downloader.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to download dir:', err.stack);
			reject(err);
		});
		downloader.on('progress', function() {
			console.log(SERVICE_NAME, '- download dir progress:', downloader.progressAmount, downloader.progressTotal);
		});
		downloader.on('end', function() {
			console.log(SERVICE_NAME, '- done downloading download');
			resolve();
		});
	});
};

module.exports.deleteDir = function(bucket, prefix) {
	return new Promise(function(resolve, reject) {
		var s3Params = {
			Bucket: bucket,
			Prefix: prefix
		};

		var client = getClient();
		var deleter = client.deleteDir(s3Params);
		deleter.on('error', function(err) {
			console.error(SERVICE_NAME, '- unable to delete dir:', err.stack);
			reject(err);
		});
		deleter.on('progress', function() {
			console.log(SERVICE_NAME, '- delete dir progress:', deleter.progressAmount, deleter.progressTotal);
		});
		deleter.on('end', function() {
			console.log(SERVICE_NAME, '- done delete dir');
			resolve();
		});
	});
};

function resolvePath(filePath) {
	return path.resolve(path.join(process.env.STORAGE_PATH, filePath));
}
