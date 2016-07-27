var Promise = require('bluebird');
var kaltura = require('./kaltura');

var KalturaClient;

var kalturaResultCallback = function(resolve, reject) {
	return function(result) {
		console.log('Kaltura Callback result:', result);
		if (result.code) {
			reject(new Error(result.message));
		} else {
			resolve(result);
		}
	};
};

module.exports = {

	initialize: initialize,

	getVideo: function(id) {
		return new Promise(function(resolve, reject) {
			KalturaClient.media.get(function(result) {
				if (result.code) {
					console.log(result);
					reject(new Error(result.message));
				} else {
					resolve(result);
				}
			}, id);
		});
	},

	addVideo: function(path) {
		return new Promise(function(resolve, reject) {
			// add media entry and then add the actual video content to media entry
			addMediaEntry()
				.then(function(mediaEntry) {
					return addContentToMedia(mediaEntry.id, path);
				})
				.catch(function(err) {
					if (err) {
						reject(err);
					}
				});
		});
	},

	generateMediaEntry: function() {
		return addMediaEntry();
	}
};

function addContentToMedia(entryId, path) {
	var kalturaResource = new kaltura.vo.KalturaServerFileResource();
	kalturaResource.localFilePath = path;

	return new Promise(function(resolve, reject) {
		KalturaClient.media.addContent(kalturaResultCallback(resolve, reject), entryId, kalturaResource);
	});
}

function addMediaEntry() {
	var kalturaMediaEntry = new kaltura.vo.KalturaMediaEntry();
	kalturaMediaEntry.mediaType = kaltura.kc.enums.KalturaMediaType.VIDEO;

	return new Promise(function(resolve, reject) {
		KalturaClient.media.add(kalturaResultCallback(resolve, reject), kalturaMediaEntry);
	});
}

function initialize() {
	return new Promise(function(resolve, reject) {
		var partnerId = process.env.KALTURA_PARTNER_ID,
			secret = process.env.KALTURA_ADMIN_SECRET,
			url = process.env.KALTURA_URL;

		if (!partnerId || !secret || !url) {
			return reject(new Error('Some parameters are missing.'));
		}

		// store client in global variable for later use
		KalturaClient = createKalturaClient(partnerId, url);

		// create session and store in global variable
		createSession(partnerId, secret, function(result) {
			// if code is set there was an error
			if (result.code) {
				return reject(new Error(result));
			}

			console.log('Got a kaltura session: ', result);
			var kalturaSession = result;
			KalturaClient.setSessionId(kalturaSession);
			resolve();
		});
	});
}

// create an admin session with kaltura
// session is returned to callback, which expects 1 result argument
function createSession(partnerId, secret, callback) {
	// admin session
	var type = kaltura.kc.enums.KalturaSessionType.ADMIN;
	// 1 year session
	var expiry = 31622400;
	// ignored when admin
	var privileges = null;
	KalturaClient.session.start(callback, secret, '', type, partnerId, expiry, privileges);
}

function createKalturaClient(partnerId, url) {
	// init kaltura configuration
	var kalturaConfig = new kaltura.kc.KalturaConfiguration(partnerId);

	kalturaConfig.serviceUrl = url;

	// init kaltura client
	var client = new kaltura.kc.KalturaClient(kalturaConfig);

	return client;
}
