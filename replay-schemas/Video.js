var Video = {

	identity: 'video',
	connection: 'mongo',
	schema: true,

	attributes: {
		sourceId: {
			type: 'string',
			required: true
		},
		provider: {
			type: 'string',
			enum: ['kaltura']
		},
		providerId: {
			type: 'string'
		},
		relativePath: {
			type: 'string',
			required: true
		},
		providerData: {
			type: 'json'
		},
		name: {
			type: 'string',
			required: true
		},
		receivingMethodStandard: {
			type: 'string',
			enum: ['VideoStandard', 'stanag'],
			required: true
		},
		receivingMethodVersion: {
			type: 'string',
			enum: ['0.9', '1.0', '4609'],
			required: true
		},
		status: {
			type: 'string',
			enum: ['processing', 'ready'],
			defaultsTo: 'processing'
		}
	}
};

module.exports = Video;
