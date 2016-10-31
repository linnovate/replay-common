// Environment variables along with their default values
module.exports = {
	'authorization_service': {
		host: process.env.AUTHORIZATION_SERVICE_HOST || 'http://localhost',
		port: process.env.AUTHORIZATION_SERVICE_PORT || '1340'
	}
};
