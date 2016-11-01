var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RelativeVideoSchema = new Schema({
	videoId: {
		type: Schema.Types.ObjectId,
		ref: 'Video',
		required: true
	},
	// Relative time for start playing the video in seconds
	relativeStartTime: {
		type: Number,
		required: true
	},
	// How long the video should be played
	duration: {
		type: Number,
		required: true
	}
});

var RelativeVideo = mongoose.model('RelativeVideo', RelativeVideoSchema);

module.exports = RelativeVideo;
