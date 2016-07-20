var amqp = require('amqplib');

var connection, channel;
var maxResendAttempts = process.env.RABBITMQ_MAX_RESEND_ATTEMPS || 3;

module.exports.connect = function(rabbitHost) {
	var rabbitUri = 'amqp://' + rabbitHost;

	// connect rabbitmq, then connect/create channel.
	return amqp.connect(rabbitUri)
		.then(createChannel);
};

// connecting to channel, attaching to appropriate queue and perform
// user callback upon incoming messages.
// prefetch is the maximum number of messages sent over the consumer that can be awaiting ack
module.exports.consume = function(queueName, maxUnackedMessagesAmount, callback) {
	// create queue if not exists
	return assertQueue(queueName)
		.then(function(ok) {
			console.log('Attached to queue:', queueName);

			// define maximum num of messages to be processed without receiving ack
			// false flag means to apply this to every new consumer
			channel.prefetch(maxUnackedMessagesAmount, false);

			return channel.consume(queueName, function(msg) {
				// convert to object
				var messageContent = JSON.parse(msg.content.toString());

				console.log('Received message from queue %s: %s', queueName, JSON.stringify(messageContent));

				// check how many times the message has failed
				var currentTransmissionNum = 0;
				if (msg.properties.headers['x-death']) {
					currentTransmissionNum = msg.properties.headers['x-death'][0].count;
				}

				// if message passed maximum of re-send attempts, ack and discard it
				if (currentTransmissionNum > maxResendAttempts) {
					console.log('Message exceeded resend attempts amount, throwing away...');
					// ack and discard message
					channel.ack(msg);
				} else {
					// else, just send the message.
					// exponential backoff: calculate total sleep time in millis
					var totalSleepMillis = Math.pow(2, currentTransmissionNum) * 1000;
					setTimeout(function() {
						// invoke callback and pass an err & done method which acks the message
						callback(messageContent,
							function err() {
								// negative-acks the message
								channel.nack(msg, false, false);
							},
							function done() {
								// acks the message
								channel.ack(msg);
							});
					}, totalSleepMillis);
				}
			}, { noAck: false });
		})
		.catch(function(err) {
			console.log('Error in consuming from %s: %s', queueName, err);
			throw err;
		});
};

// produce a message to specific queue.
// this method does not return anything no purpose;
// the client has nothing to do with such failures, the message jus't won't be sent
// and a log will be emitted.
module.exports.produce = function(queueName, message) {
	// create queue if not exists
	return assertQueue(queueName)
		.then(function(ok) {
			console.log('Sending message to queue:', message);
			return channel.sendToQueue(queueName, new Buffer(JSON.stringify(message)), { persistent: true });
		})
		.catch(function(err) {
			console.log('Error in producing to %s: %s', queueName, err);
			throw err;
		});
};

function createChannel(conn) {
	connection = conn;
	return connection.createChannel()
		.then(function(ch) {
			channel = ch;
			channel.on('close', onChannelClose);
			channel.on('error', onChannelError);
			console.log('Connected to RabbitMQ.');
		});
}

// create queue if not exists
function assertQueue(queueName) {
	// durable: persist queue messages
	// deadLetterExchange: use default exchange
	// deadLetterRoutingKey: router dead letter messages back to original queue
	return channel.assertQueue(queueName, { durable: true, deadLetterExchange: '', deadLetterRoutingKey: queueName });
}

// A channel will emit 'close' once the closing handshake (possibly initiated by calling close()) has completed;
// or, if its connection closes.
function onChannelClose() {
	console.log('Channel has closed.');
}

// A channel will emit 'error' if the server closes the channel for any reason.
// Such reasons include:
//  * an operation failed due to a failed precondition (usually something named in an argument not existing)
//  * an human closed the channel with an admin tool
// A channel will not emit 'error' if its connection closes with an error.
function onChannelError() {
	console.log('Channel has errored.');
}
