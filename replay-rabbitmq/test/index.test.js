var util = require('util');
var config = require('./config'),
	rabbit = require('../index');

var testQueueName = 'testQueue';

describe('replay-rabbitmq tests', function() {
	before(function() {
		config.resetEnvironment();
		return rabbit.connect(process.env.RABBITMQ_HOST)
			.then(() => rabbit.deleteQueue(testQueueName));
	});

	after(function() {
		return rabbit.connect(process.env.RABBITMQ_HOST)
			.then(() => rabbit.deleteQueue(testQueueName));
	});

	describe('sanity tests', function() {
		beforeEach(function() {
			config.resetEnvironment();
			return rabbit.connect(process.env.RABBITMQ_HOST)
				.then(() => rabbit.deleteQueue(testQueueName));
		});

		it('should produce message', function(done) {
			var message = {
				title: 'test'
			};

			rabbit
				.produce(testQueueName, message)
				.then(() => done())
				.catch(done);
		});

		it('should consume message', function(done) {
			var message = {
				title: 'test'
			};

			rabbit
				.produce(testQueueName, message)
				.then(function() {
					return new Promise(function(reject, resolve) {
						rabbit.consume(testQueueName, 1, function(params, _error, _done) {
							expect(params).to.deep.equal(message);
							_done();
							resolve();
						});
					});
				})
				.then(done)
				.catch(done);
		});

		it(util.format('should retry consuming message %s times', process.env.RABBITMQ_MAX_RESEND_ATTEMPS), function(done) {
			var maxRetrySleepMillis = 0;
			// sum up the total time we're going to sleep due to re-send attempts
			for (var i = 0; i <= process.env.RABBITMQ_MAX_RESEND_ATTEMPS; i++) {
				maxRetrySleepMillis += Math.pow(2, i) * 1000;
			}
			// add some safety gap
			maxRetrySleepMillis += 2 * 1000;
			// set the timeout for the test
			console.log('Timeout:', maxRetrySleepMillis);
			this.timeout(maxRetrySleepMillis);

			var consumptionCounter = 0;
			var message = {
				title: 'test'
			};

			rabbit
				.produce(testQueueName, message)
				.then(function() {
					return new Promise(function(reject, resolve) {
						rabbit.consume(testQueueName, 1, function(params, _error, _done) {
							++consumptionCounter;
							if (consumptionCounter > process.env.RABBITMQ_MAX_RESEND_ATTEMPS) {
								_done();
								return resolve();
							}
							_error();
						});
					});
				})
				.then(done)
				.catch(done);
		});
	});

	describe('bad input tests', function() {
		it('#connect host invalid', function(done) {
			rabbit
				.connect('someNotExistedHost')
				.then(() => done(new Error('Connected with invalid rabbitmq host.')))
				.catch(() => done());
		});

		it('#consume negative maxUnackedMessagesAmount', function(done) {
			rabbit
				.consume(testQueueName, -1, function(params, error, done) {})
				.catch(() => done());
		});
	});
});
