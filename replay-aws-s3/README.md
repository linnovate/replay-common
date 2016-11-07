
# A simple wrapper for Amazon S3

Amazon Web Services (AWS) - [Amazon S3](https://aws.amazon.com/s3/) (Amazon Simple Storage Service) wrapper for Replay project.
Using the [S3 npm package](https://www.npmjs.com/package/s3) for high level client of the [aws-sdk](https://www.npmjs.com/package/aws-sdk) module.

## Environment variables

| Name                         | Description                  | Default                      |
|------------------------------|------------------------------|------------------------------|
| AWS_REGION                   | AWS region                   | eu-west-1                    |
| AWS_ACCESS_KEY_ID            | AWS access key id            | **required**                 |
| AWS_SECRET_ACCESS_KEY        | AWS secret access key        | **required**                 |


## Installation

```sh
npm install replay-aws-s3 --save
```

## Usage

```js

var s3 = require('replay-aws-s3');
// TODO...

```

## Extra Info:

See also:

* [AWS SDK for JavaScript - Developer Guide](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html)
* [AWS SDK for JavaScript - API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
