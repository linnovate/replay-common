var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// The idea of JobStatus:
// Using it's unique id to identify a transaction in the queues,
// Determine the current state of the flow in the queues in order to recover
// from a failure.
// Upon each significant action (such as insertion of video object to db,
// insertion of VideoMetadata to elastic or mogo, upload to provider, etc),
// The service will be able to determine if this action has been already done or not,
// in order to prevent duplicates upon failure retries.

// create a schema
var JobStatusSchema = new Schema({
	statuses: {
		type: [String],
		enum: ['started', 'video-object-saved', 'uploaded-to-kaltura', 'fetched-from-kaltura', 'parsed-metadata', 'saved-metadata-to-mongo', 'saved-metadata-to-elastic'],
		default: ['started']
	}
}, {
	timestamps: true
});

var JobStatus = mongoose.model('JobStatus', JobStatusSchema);

module.exports = JobStatus;