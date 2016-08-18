#! /usr/bin/env node

var path = require('path');

var Promise = require('bluebird'),
	connectMongo = require('replay-schemas/connectMongo');

const MONGO_HOST = process.env.MONGO_HOST || 'localhost',
	MONGO_PORT = process.env.MONGO_PORT || 27017,
	MONGO_DATABASE = process.env.MONGO_DATABASE || 'replay_dev',
	REPLAY_SCHEMA = process.env.REPLAY_SCHEMA,
	DATA_FILE = process.env.DATA_FILE;

checkInput()
	.then(connectMongo(MONGO_HOST, MONGO_PORT, MONGO_DATABASE))
	.then(mongoInit)
	.then(function() {
		console.log('Mongo initialization completed successfully.');
		process.exit(0);
	})
	.catch(function(err) {
		console.log('ERROR: ' + err);
		process.exit(1);
	});

function checkInput() {
	console.log('Mongo host: ', MONGO_HOST);
	console.log('Mongo port: ', MONGO_PORT);
	console.log('Mongo database: ', MONGO_DATABASE);
	console.log('Replay schema: ', REPLAY_SCHEMA);
	console.log('Data file: ', DATA_FILE);

	if (!REPLAY_SCHEMA || !DATA_FILE) {
		return Promise.reject('Some vital parameters are missing!');
	}
	return Promise.resolve();
}

function mongoInit() {
	var SchemaObj = require('replay-schemas/' + REPLAY_SCHEMA);

	var dataFilePath = path.join('../data-files', DATA_FILE + '.json');
	var data = require(dataFilePath);

	return SchemaObj.insertMany(data)
		.then(function() {
			console.log('Insertion completed successfully.');
			return Promise.resolve();
		})
		.catch(function(err) {
			return Promise.reject('Insertion failure! \n' + err);
		});
}
