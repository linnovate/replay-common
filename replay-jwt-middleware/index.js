var moment = require('moment'),
	jwt = require('jwt-simple');

var _authorizarionHeader = 'Authorization';

module.exports = function (req, res, next) {
	console.log('JWT middleware running...');
	if (!req.header(_authorizarionHeader)) {
		console.log('Request lacks Authorization header.');
		return res.status(401).send({ message: 'Please make sure your request has an Authorization header.' });
	}
	var token = req.header(_authorizarionHeader).split(' ')[1];

	var payload = null;
	try {
		payload = jwt.decode(token, sails.config.settings.token_secret);
	} catch (err) {
		console.log('Error decoding JWT:', err);
		return res.status(401).send({ message: err.message });
	}

	if (payload.exp <= moment().unix()) {
		console.log('Request token has expired.');
		return res.status(401).send({ message: 'Token has expired.' });
	}
	console.log('JWT is valid.');
	req.userId = payload.sub;
	console.log('req.userId was set with user ID:', payload.sub);
	next();
};
