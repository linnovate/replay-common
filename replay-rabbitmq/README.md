# RabbitMQ wrapper for Replay project.

## Installation of RabbitMQ

Simply download and install [RabbitMQ 3.6.4](http://www.rabbitmq.com/releases/rabbitmq-server/v3.6.4/rabbitmq-server_3.6.4-1_all.deb)


In order to manage the maximum amount of connections upon launch,  
open up and edit the following configuration file using nano:
```
sudo nano /etc/default/rabbitmq-server
```
Uncomment the limit line `ulimit -n 1024` (i.e. remove the _'#'_ in the last line),  
and don't forget to save before exit by pressing CTRL+X followed with Y.


## Management plugin

First enable the management plugin by:
```
sudo rabbitmq-plugins enable rabbitmq_management
```

Then visit the following url to view the RabbitMQ management plugin,  
where you can view connections, channels, queues, and administer the RabbitMQ:
```
http://server-name:15672/
```
_([localhost:15672](http://localhost:15672/) in development)_

Default Username & Password are: **guest**.

==================================================

If it doesn't work for some reason, try run this command:
```
sudo rabbitmqctl start_app
```
**************************************************

## Package Configurations

Possible environment variables:
```
RABBITMQ_MAX_RESEND_ATTEMPS
```
