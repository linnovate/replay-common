replay-db-initialization
==============================

### DB initialization scripts for Replay project.

This _replay-db-initialization_ is a scripts package for database (MongoDB & Elasticsearch) initialization with [replay-schemas](https://github.com/linnovate/replay-common/tree/develop/replay-schemas) objects.


Installation
-----------------------------

Simply install the package as a global npm package by running the command:

```sh
npm install -g replay-db-initialization
```


Usage
------------------------------

### 1. Mongo-init

To run just initialize the environment variables and run `mongo-init`.

For example, to initialize the _video-recorder_ run the following command:

```sh
MONGO_HOST=localhost MONGO_PORT=27017 MONGO_DATABASE=replay_dev REPLAY_SCHEMA=StreamingSource DATA_FILE=streaming-source mongo-init
```

Another example, to initialize the video db run the following command:

```sh
MONGO_HOST=localhost MONGO_PORT=27017 MONGO_DATABASE=replay_dev REPLAY_SCHEMA=Video DATA_FILE=video mongo-init
```

#### Environment variables:

| Name           | Explanation |
|:---------------|:------------|
| `MONGO_HOST`     | MongoDB server host name |
| `MONGO_PORT`     | MongoDB server port |
| `MONGO_DATABASE` | MongoDB database |
| `REPLAY_SCHEMA`  | Replay-schemas object model name |
| `DATA_FILE`      | Json data file name (inside _data-files_ directory) ** without the .json extension ** |



### 2. Elastic-init

#### _Will be implemented in the future releases..._
