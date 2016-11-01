var nock = require('nock');
var User = require('replay-schemas/User');

// used in order to authenticate requests
var _user;

module.exports.createUser = function () {
	return User.create({
		displayName: 'Test User',
		providerDetails: {
			name: 'adfs-saml',
			id: 'someUniqueId'
		}
	})
		.then((user) => {
			_user = user;
			return Promise.resolve(user);
		});
};

module.exports.getUser = function() {
	return _user;
};

// a stub that fills req.userId when testing
module.exports.jwtMiddlewareStub = function (req, res, next) {
	if (!_user) {
		return next(new Error('jwtMiddlewareStub was called before user was created.'));
	}
	req.userId = _user.id;
	return next();
};

module.exports.mockAuthorizationService = function (authorizationServiceUrl) {
	if (!_user) {
		return Promise.reject(new Error('mockAuthorizationService was called before user was created.'));
	}

	nock(authorizationServiceUrl)
		.log(console.log)
		.persist()
		.get('/compartment')
		.query({ id: _user.id })
		.reply(200, [{ id: ['System 1'], level: ['1'] }]);
	return Promise.resolve();
};

// user for mocking authentication, therefore needs to be wiped only at the end
module.exports.wipeUserCollection = function () {
	return User.remove({});
};

