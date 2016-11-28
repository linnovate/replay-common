
var Promise = require('bluebird'),
	ReplayLogger = require('replay-logger'),
	s3 = require('s3');

var logger = new ReplayLogger('replay-aws-s3');

module.exports = new function() {
	function getClient() {
		var options = {
			maxAsyncS3: 20, // default value
			s3RetryCount: 3, // default value
			s3RetryDelay: 1000, // default value
			multipartUploadThreshold: 20 * 1024 * 1024, // default value (20 MB)
			multipartUploadSize: 15 * 1024 * 1024, // default value (15 MB)
			s3Options: {
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				endpoint: process.env.AWS_ENDPOINT,
				region: process.env.AWS_REGION,
				sslEnabled: false,
				s3ForcePathStyle: true
				// s3BucketEndpoint: true,
				// paramValidation: false,
				// logger: logger
			}
		};
		return s3.createClient(options);
	}

	function uploadFile(filePath, bucket, key) {
		return new Promise(function(resolve, reject) {
			var params = {
				localFile: filePath,
				defaultContentType: 'application/octet-stream', // default value
				s3Params: { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
					Bucket: bucket,
					Key: key
				}
			};
			var client = getClient();
			var uploader = client.uploadFile(params);
			uploader.on('error', function(err) {
				logger.error(err, 'unable to upload file');
				reject(err);
			});
			uploader.on('progress', function() {
				var progress = {
					progressMd5Amount: uploader.progressMd5Amount,
					progressAmount: uploader.progressAmount,
					progressTotal: uploader.progressTotal
				};
				logger.trace({ progress: progress }, 'upload file progress');
			});
			uploader.on('end', function(data) {
				logger.info({ data: data }, 'done uploading file');
				resolve(data);
			});
		});
	}

	function downloadFile(filePath, bucket, key) {
		return new Promise(function(resolve, reject) {
			var params = {
				localFile: filePath,
				s3Params: { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
					Bucket: bucket,
					Key: key
				}
			};
			var client = getClient();
			var downloader = client.downloadFile(params);
			downloader.on('error', function(err) {
				logger.error(err, 'unable to download file');
				reject(err);
			});
			downloader.on('progress', function() {
				var progress = {
					progressAmount: downloader.progressAmount,
					progressTotal: downloader.progressTotal
				};
				logger.trace({ progress: progress }, 'download file progress');
			});
			downloader.on('end', function() {
				logger.info('done downloading file');
				resolve();
			});
		});
	}

	function downloadBuffer(bucket, key) {
		return new Promise(function(resolve, reject) {
			var s3Params = { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
				Bucket: bucket,
				Key: key
			};
			var client = getClient();
			var downloader = client.downloadBuffer(s3Params);
			downloader.on('error', function(err) {
				logger.error(err, 'unable to download buffer');
				reject(err);
			});
			downloader.on('progress', function() {
				var progress = {
					progressAmount: downloader.progressAmount,
					progressTotal: downloader.progressTotal
				};
				logger.trace({ progress: progress }, 'download buffer progress');
			});
			downloader.on('end', function(buffer) {
				logger.info('done downloading buffer');
				resolve(buffer);
			});
		});
	}

	function listObjects(bucket, prefix) {
		return new Promise(function(resolve, reject) {
			var params = {
				s3Params: { // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
					Bucket: bucket,
					Prefix: prefix
					// Delimiter: 'STRING_VALUE',
					// EncodingType: 'url',
					// Marker: 'STRING_VALUE',
					// MaxKeys: 0,
				},
				recursive: true
			};
			var client = getClient();
			var lister = client.listObjects(params);
			var result = [];
			lister.on('error', function(err) {
				logger.error(err, 'unable to list objects');
				reject(err);
			});
			lister.on('progress', function() {
				var progress = {
					progressAmount: lister.progressAmount,
					objectsFound: lister.objectsFound,
					dirsFound: lister.dirsFound
				};
				logger.trace({ progress: progress }, 'list objects progress');
			});
			lister.on('data', function(data) {
				logger.debug({ data: data }, 'list objects data');
				result = result.concat(data.Contents);
			});
			lister.on('end', function() {
				logger.info({ result: result }, 'done list objects');
				resolve(result);
			});
		});
	}

	function deleteObjects(bucket, objects) {
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
				logger.error(err, 'unable to delete objects');
				reject(err);
			});
			deleter.on('progress', function() {
				var progress = {
					progressAmount: deleter.progressAmount,
					progressTotal: deleter.progressTotal
				};
				logger.trace({ progress: progress }, 'delete objects progress');
			});
			deleter.on('data', function(data) {
				logger.debug({ data: data }, 'delete objects data');
			});
			deleter.on('end', function() {
				logger.info('done deleting objects');
				resolve();
			});
		});
	}

	function uploadDir(dirPath, bucket, prefix) {
		return new Promise(function(resolve, reject) {
			require('http').globalAgent.maxSockets = process.env.MAX_SOCKETS;
			require('https').globalAgent.maxSockets = process.env.MAX_SOCKETS;

			function getS3Params(localFile, stat, callback) {
				// // call callback like this:
				// var err = new Error('some error info'); // only if there is an error

				// var s3Params = { // if there is no error
				// 	ContentType: getMimeType(localFile) // just an example
				// };

				// callback(err, s3Params); // pass `null` for `s3Params` if you want to skip uploading this file

				callback(undefined, {});
			}

			var params = {
				localDir: dirPath,
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
				logger.error(err, 'unable to upload dir');
				reject(err);
			});
			uploader.on('progress', function() {
				var progress = {
					progressAmount: uploader.progressAmount,
					progressTotal: uploader.progressTotal,
					progressMd5Amount: uploader.progressMd5Amount,
					progressMd5Total: uploader.progressMd5Total,
					deleteAmount: uploader.deleteAmount,
					deleteTotal: uploader.deleteTotal,
					filesFound: uploader.filesFound,
					objectsFound: uploader.objectsFound,
					doneFindingFiles: uploader.doneFindingFiles,
					doneFindingObjects: uploader.doneFindingObjects,
					doneMd5: uploader.doneMd5
				};
				logger.trace({ progress: progress }, 'upload dir progress');
			});

			uploader.on('end', function() {
				logger.info('done uploading dir');
				resolve();
			});
		});
	}

	function downloadDir(dirPath, bucket, prefix) {
		return new Promise(function(resolve, reject) {
			require('http').globalAgent.maxSockets = process.env.MAX_SOCKETS;
			require('https').globalAgent.maxSockets = process.env.MAX_SOCKETS;

			function getS3Params(localFile, s3Object, callback) {
				// localFile is the destination path where the object will be written to
				// s3Object is same as one element in the `Contents` array from here:
				// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property

				// // call callback like this:
				// var err = new Error('some error info'); // only if there is an error

				// var s3Params = { // if there is no error
				// 	VersionId: 'some versionId' // just an example
				// };

				// callback(err, s3Params); // pass `null` for `s3Params` if you want to skip uploading this file

				callback(undefined, {});
			}

			var params = {
				localDir: dirPath,
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
				logger.error(err, 'unable to download dir');
				reject(err);
			});
			downloader.on('progress', function() {
				var progress = {
					progressAmount: downloader.progressAmount,
					progressTotal: downloader.progressTotal,
					progressMd5Amount: downloader.progressMd5Amount,
					progressMd5Total: downloader.progressMd5Total,
					deleteAmount: downloader.deleteAmount,
					deleteTotal: downloader.deleteTotal,
					filesFound: downloader.filesFound,
					objectsFound: downloader.objectsFound,
					doneFindingFiles: downloader.doneFindingFiles,
					doneFindingObjects: downloader.doneFindingObjects,
					doneMd5: downloader.doneMd5
				};
				logger.trace({ progress: progress }, 'download dir progress');
			});
			downloader.on('end', function() {
				logger.info('done downloading dir');
				resolve();
			});
		});
	}

	function deleteDir(bucket, prefix) {
		return new Promise(function(resolve, reject) {
			var s3Params = {
				Bucket: bucket,
				Prefix: prefix
			};

			var client = getClient();
			var deleter = client.deleteDir(s3Params);
			deleter.on('error', function(err) {
				logger.error(err, 'unable to delete dir');
				reject(err);
			});
			deleter.on('progress', function() {
				var progress = {
					progressAmount: deleter.progressAmount,
					progressTotal: deleter.progressTotal
				};
				logger.trace({ progress: progress }, 'delete dir progress');
			});
			deleter.on('end', function() {
				logger.info('done deleting dir');
				resolve();
			});
		});
	}

	function createBucket(bucket) {
		return new Promise(function(resolve, reject) {
			var params = {
				Bucket: bucket,
				ACL: 'public-read-write'
			};

			var client = getClient();
			client.s3.createBucket(params, function(err, data) {
				if (err) {
					logger.error(err, 'unable to create bucket');
					reject(err);
				} else {
					logger.info({ data: data }, 'bucket %s successfully created', bucket);
					resolve(data);
				}
			});
		});
	}

	function deleteBucket(bucket) {
		return new Promise(function(resolve, reject) {
			var params = {
				Bucket: bucket
			};

			var client = getClient();
			client.s3.deleteBucket(params, function(err, data) {
				if (err) {
					logger.error(err, 'unable to delete bucket');
					reject(err);
				} else {
					logger.info({ data: data }, 'bucket %s successfully deleted', bucket);
					resolve(data);
				}
			});
		});
	}

	function listBuckets() {
		return new Promise(function(resolve, reject) {
			var client = getClient();
			client.s3.listBuckets(function(err, data) {
				if (err) {
					logger.error(err, 'unable to list buckets');
					reject(err);
				} else {
					logger.info({ data: data }, 'done buckets list');
					resolve(data);
				}
			});
		});
	}

	function validateProcessEnv() {
		// set default values:
		process.env.MAX_SOCKETS = process.env.MAX_SOCKETS || 20;
		process.env.AWS_REGION = process.env.AWS_REGION || 'eu-west-1';

		logger.info('AWS access key id: %s', process.env.AWS_ACCESS_KEY_ID);
		logger.info('AWS secret access key: %s', process.env.AWS_SECRET_ACCESS_KEY);
		logger.info('AWS endpoint: %s', process.env.AWS_ENDPOINT);
		logger.info('AWS region: %s', process.env.AWS_REGION);
		logger.info('Max sockets: %s', process.env.MAX_SOCKETS);

		// validate required process environment variables
		if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
			return false;
		}
		return true;
	}

	if (validateProcessEnv()) {
		return {
			// General functions:
			getAWS: function() {
				return s3.AWS;
			},
			getClient: function() {
				return getClient();
			},
			// Files functions:
			uploadFile: function(filePath, bucket, key) {
				return uploadFile(filePath, bucket, key);
			},
			downloadFile: function(filePath, bucket, key) {
				return downloadFile(filePath, bucket, key);
			},
			downloadBuffer: function(bucket, key) {
				return downloadBuffer(bucket, key);
			},
			// Objects functions:
			listObjects: function(bucket, prefix) {
				return listObjects(bucket, prefix);
			},
			deleteObjects: function(bucket, objects) {
				return deleteObjects(bucket, objects);
			},
			// Directories functions:
			uploadDir: function(dirPath, bucket, prefix) {
				return uploadDir(dirPath, bucket, prefix);
			},
			downloadDir: function(dirPath, bucket, prefix) {
				return downloadDir(dirPath, bucket, prefix);
			},
			deleteDir: function(bucket, prefix) {
				return deleteDir(bucket, prefix);
			},
			// Buckets functions:
			listBuckets: function() {
				return listBuckets();
			},
			createBucket: function(bucket) {
				return createBucket(bucket);
			},
			deleteBucket: function(bucket) {
				return deleteBucket(bucket);
			}
		};
	}
	// else:
	throw new Error('Invalid process environment variables');
};
