var util = require('util');

var moment = require('moment'),
	chalk = require('chalk');

// chalk.enabled = true;

module.exports = function(err) {
	var ctx = new chalk.constructor({ enabled: true });

	process.stderr.write(util.format('[%s] %s: %s \n%s\n',
		moment().format('dddd, MMMM Do YYYY, HH:mm:ss.SSS'),
		ctx.red('REPLAY-LOGGER ERROR'),
		ctx.cyan(err.message),
		err.stack));
};
