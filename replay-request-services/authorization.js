var requestAsPromise = require('request-promise');

var config = require('./config');

function getAuthorizationServiceUrl() {
	return config.authorization_service.host + ':' + config.authorization_service.port;
}
module.exports.getAuthorizationServiceUrl = getAuthorizationServiceUrl;

// requesting the user's permissions from the authentication-service
module.exports.findPermissionsByUserId = function (userId) {
	console.log('Finding permission to user of id:', userId);

	var authorizationServiceUrl = getAuthorizationServiceUrl() + '/compartment';
	console.log('Requesting permissions from authorization-service in url:', authorizationServiceUrl);

	var options = {
		url: authorizationServiceUrl,
		qs: { id: userId },
		json: true
	};
	return requestAsPromise(options)
		.then((permissions) => {
			console.log('Permissions are:', JSON.stringify(permissions));
			return Promise.resolve(permissions);
		});
};
