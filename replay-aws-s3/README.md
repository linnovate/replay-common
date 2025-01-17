
# A simple wrapper for Amazon S3

Amazon Web Services (AWS) - [Amazon S3](https://aws.amazon.com/s3/) (Amazon Simple Storage Service) wrapper for Replay project.  
Using the [S3 npm package](https://www.npmjs.com/package/s3) for high level client of the [aws-sdk](https://www.npmjs.com/package/aws-sdk) module.

## Process environment variables

| Name                         | Description                  | Default                      |
|------------------------------|------------------------------|------------------------------|
| AWS_ACCESS_KEY_ID            | AWS S3 access key id         | **required**                 |
| AWS_SECRET_ACCESS_KEY        | AWS S3 secret access key     | **required**                 |
| AWS_ENDPOINT                 | AWS S3 endpoint              | Amazon default: something like `http://s3-{region}.amazonaws.com` |
| AWS_REGION                   | AWS S3 region                | eu-west-1                    |
| MAX_SOCKETS                  | Socket pool size in the http & https global agents. <br> (This will improve bandwidth when using uploadDir and downloadDir functions.) | 20 |

## Installation

```sh
npm install replay-aws-s3 --save
```

## API Usage

```js

var s3 = require('replay-aws-s3');

// General functions:
s3.getAWS();

s3.getClient();

// Files functions:
s3.uploadFile(filePath, bucket, key);
s3.downloadFile(filePath, bucket, key);
s3.downloadBuffer(bucket, key);

// Objects functions:
s3.listObjects(bucket, prefix);
s3.deleteObjects(bucket, objects);

// Directories functions:
s3.uploadDir(dirPath, bucket, prefix);
s3.downloadDir(dirPath, bucket, prefix);
s3.deleteDir(bucket, prefix);

// Buckets functions:
s3.listBuckets();
s3.createBucket(bucket);
s3.deleteBucket(bucket);

// TODO...

```

## Extra Info:

See also:

* [AWS SDK for JavaScript - Developer Guide](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html)
* [AWS SDK for JavaScript - API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
