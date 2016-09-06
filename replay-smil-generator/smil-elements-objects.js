function VideoNode(params) {
	var self = this;
	if (videoParamsValid(params)) {
		self.$ = { 'height': params.height, 'src': params.src, 'width': params.width };
		self.param = [{
			$: {
				name: 'videoBitrate',
				value: params.videoBitrate,
				valuetype: 'data'
			}
		}, {
			$: {
				name: 'audioBitrate',
				value: params.audioBitrate,
				valuetype: 'data'
			}
		}];
	}
}

function SmilNode(title) {
	var self = this;
	self.smil = {};
	self.smil.$ = {
		title: title
	};
	self.smil.body = {
		switch: {
			video: [],
			audio: [],
			textstream: []
		}
	};
}

function videoParamsValid(params) {
	if (params.height && params.width && params.src && params.videoBitrate) {
		return true;
	}
	return false;
}

module.exports = {
	VideoNode: VideoNode,
	SmilNode: SmilNode
};
