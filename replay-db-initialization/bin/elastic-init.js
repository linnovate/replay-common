#! /usr/bin/env node

var Promise = require('bluebird'),
	parseArgs = require('minimist'),
	elasticsearch = require('replay-elastic');

const ELASTIC_HOST = process.env.ELASTIC_HOST,
	ELASTIC_PORT = process.env.ELASTIC_PORT;

function main() {
	initConnection()
		.then(function() {
			var argv = parseArgs(process.argv, { alias: { 'D': 'delete' } });
			if (argv.delete) {
				return deleteAllIndices();
			}
			return Promise.resolve();
		})
		.then(elasticsearch.createVideoMetadataIndex)
		.then(function() {
			console.log('VideoMetadata index created successfully.');
			process.exit(0);
		})
		.catch(function(err) {
			console.log('ERROR - Elasticsearch initialization failure! \n' + err);
			process.exit(1);
		});
}

main();

function initConnection() {
	elasticsearch.connect(ELASTIC_HOST, ELASTIC_PORT);
	return Promise.resolve();
}

function deleteAllIndices() {
	return elasticsearch.deleteAllIndices()
		.then(function() {
			console.log('All Elasticsearch indices was successfully deleted.');
			return Promise.resolve();
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
}
