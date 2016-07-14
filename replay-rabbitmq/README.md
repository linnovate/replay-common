## Installation of RabbitMQ
```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1397BC53640DB551
sudo apt-get update
sudp apt-get -y upgrade
sudo su -c "echo 'deb http://www.rabbitmq.com/debian/ testing main' >> /etc/apt/sources.list
"
curl http://www.rabbitmq.com/rabbitmq-signing-key-public.asc | sudo apt-key add -
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6B73A36E6026DFCA
sudo apt-get update
sudo apt-get install rabbitmq-server
```

In order to manage the maximum amount of connections upon launch, open up and edit the following configuration file using nano:
```
sudo nano /etc/default/rabbitmq-server
```
Uncomment the limit line (i.e. remove #) before saving and exit by pressing CTRL+X followed with Y.
