
# A Shareable Logger tool for all Replay project

#### Just a simple wrapper for [node-bunyan](https://github.com/trentm/node-bunyan)


## Environment variables

| Name               | Description        | Default            |
|--------------------|--------------------|--------------------|
| NODE_ENV           | Node Environment   | development        |
| LOG_PATH           | Log files path     | $HOME/replay-logs <br> _(using `process.env.HOME` to get the user home directory)_ |


## Installation

```sh
npm install replay-logger --save
```

## Usage

```js

// Init:
var ReplayLogger = require('replay-logger');
var logger = new ReplayLogger('serviceName');

// then use level name for logging, for example:
logger.trace('Some trace log message...');
logger.debug('Some debug log message...');
logger.info('Some info log message...');
logger.warn('Some warn log message...');
logger.error('Some error log message...');
logger.fatal('Some fatal log message...');

// you can also use 'log' function for logging info level
logger.log('Some info log message...');

// You can also use format for msg formatting.
logger.info('hi %s', 'bob');

// First field can optionally be a "fields" object, which is merged into the log record.
logger.info({foo: 'bar'}, 'hi');

// Special case to log an `Error` instance to the record.
// This adds an "err" field with exception details (including the stack) and sets "msg" to the exception message.
log.info(err);  
logger.info(err, 'more on this: %s', 'some more info');


// To pass in an Error and other fields, use the `err` field name for the Error instance.
log.info({foo: 'bar', err: err}, 'some msg about this error');

```

## Extra Info:

[level-suggestions](https://github.com/trentm/node-bunyan#level-suggestions)
