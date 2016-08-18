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

Mongo-init script use the _replay-schemas_ to initialize a schema object model from a given Json data file.

#### Environment variables:

| Name             | Explanation                                         | Default Value  |
|:-----------------|:----------------------------------------------------|----------------|
| `MONGO_HOST`     | MongoDB server host name                            | localhost      |
| `MONGO_PORT`     | MongoDB server port                                 | 27017          |
| `MONGO_DATABASE` | MongoDB database                                    | replay_dev     |
| `REPLAY_SCHEMA`  | Replay-schemas object model name                    | ** Required ** |
| `DATA_FILE`      | Json data file name (inside _data-files_ directory) ** without the _.json_ extension ** | ** Required ** |

#### Running:

To run just initialize the environment variables and run `mongo-init`.

For example, to initialize the _video-recorder_ run the following command:
```sh
MONGO_HOST=localhost MONGO_PORT=27017 MONGO_DATABASE=replay_dev REPLAY_SCHEMA=StreamingSource DATA_FILE=streaming-source mongo-init
```

Another example, to initialize the video db run the following command:
```sh
MONGO_HOST=localhost MONGO_PORT=27017 MONGO_DATABASE=replay_dev REPLAY_SCHEMA=Video DATA_FILE=video mongo-init
```

### 2. Elastic-init

#### _Will be implemented in the future releases..._
