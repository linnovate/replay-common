var amqp = require('amqplib');

var channel;

module.exports.connect = function(rabbitHost) {
	var rabbitUri = 'amqp://' + rabbitHost;

	// connect rabbitmq, then connect/create to channel.
	return amqp.connect(rabbitUri)
		.then(function(conn) {
			return conn.createChannel();
		})
		.then(function(ch) {
			channel = ch;
			console.log('Connected to RabbitMQ.');
		});
};

// connecting to channel, attaching to appropriate queue and perform
// user callback upon incoming messages.
// prefetch is the maximum number of messages sent over the consumer that can be awaiting ack
module.exports.consume = function(queueName, maxUnackedMessagesAmount, callback) {
	channel.assertQueue(queueName)
		.then(function(ok) {
			// define maximum num of messages to be processed without receiving ack
			// false flag means to apply this to every new consumer
			channel.prefetch(maxUnackedMessagesAmount, false);

			return channel.consume(queueName, function(msg) {
				// invoke callback and pass a done method which acks the message
				callback(JSON.parse(msg.content.toString()), () => {
					channel.ack(msg);
				});
			}, { noAck: false });
		})
		.catch(function(err) {
			console.log('Error in producing to %s: %s', queueName, err);
		});
};

// produce a message to specific queue.
// this method does not return anything no purpose;
// the client has nothing to do with such failures, the message jus't won't be sent
// and a log will be emitted.
module.exports.produce = function(queueName, message) {
	channel.assertQueue(queueName, { durable: true })
		.then(function(ok) {
			return channel.sendToQueue(queueName, new Buffer(JSON.stringify(message)), { persistent: true });
		})
		.catch(function(err) {
			console.log('Error in producing to %s: %s', queueName, err);
		});
};
