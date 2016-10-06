var path = require('path');

var Logger = require('../index.js');

describe('Logger tests', function() {
	before(function() {
		process.env.LOG_PATH = path.join(__dirname, 'log-files');
	});
	after(function() {});

	describe('Some tests', tests);
});

function tests() {
	beforeEach(function() {
		process.env.NODE_ENV = 'test';
		Logger = new Logger('testLogger');
	});
	afterEach(function() {});

	it('Some test...', function(done) {
		try {
			Logger.info('Some info log message...');
			done();
		} catch (err) {
			done(new Error('captions file not found'));
		}
	});
}
