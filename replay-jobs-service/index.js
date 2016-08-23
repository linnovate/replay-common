var fs = require('fs'),
	path = require('path');

var JobStatus = require('replay-schemas/JobStatus'),
	_ = require('lodash');

// try to save jobTypes here insteas of reloading them on each request
var jobTypes;
var jobTypesPath = path.join(__dirname, 'queues_config', 'job-types.json');

// load jobTypes file only if not loaded yet
function loadJobTypesJson() {
	if (!jobTypes) {
		jobTypes = JSON.parse(fs.readFileSync(jobTypesPath, 'utf8'));
		return jobTypes;
	}
	return jobTypes;
}

function getJobConfig(jobType) {
	loadJobTypesJson();

	var job = _.find(jobTypes, function(job) {
		return job.type === jobType;
	});

	return job;
}

// check if we are familiar with this job type
module.exports.isKnownJobType = function(jobType) {
	loadJobTypesJson();

	return _.some(jobTypes, function(job) {
		return job.type === jobType;
	});
};

module.exports.getAllJobConfigs = function() {
	return loadJobTypesJson();
};

// get service name from the jobTypes array
module.exports.getServiceName = function(jobType) {
	return getJobConfig(jobType).service;
};

// get queue name from the jobTypes array
module.exports.getQueueName = function(jobType) {
	return getJobConfig(jobType).queue;
};

module.exports.getQueueMaxMessagesAmount = function(jobType) {
	return getJobConfig(jobType).maxMessagesAmount;
};

// find a JobStatus with such id or create one if not exists.
module.exports.findOrCreateJobStatus = function(transactionId) {
	// upsert: create if not exist; new: return updated value
	return JobStatus.findByIdAndUpdate({ _id: transactionId }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });
};

module.exports.findJobStatus = function(transactionId) {
	return JobStatus.findById(transactionId);
};

module.exports.updateJobStatus = function(transactionId, jobStatusTag) {
	// addToSet: add to array list as set (e.g. no duplicates);
	return JobStatus.findOneAndUpdate({ _id: transactionId }, { $addToSet: { statuses: jobStatusTag } })
		.then(function(jobStatus) {
			if (jobStatus) {
				console.log('Updated job status successfuly.');
			}
			Promise.resolve(jobStatus);
		});
};
