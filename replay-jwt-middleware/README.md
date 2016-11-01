## Description
A middleware for Sails.js which sets req.userId to the user's ID taken from the Json Web Token in the  
Authorization request header.  

## Setup
A secret is required in order to decode the JWT, so make sure to have it configured in  
`sails.config.settings.token_secret`.

## Usage
You can set this module as middleware in your app:
```
// http.js
middleware: {
	order: [
		'replayJwtMiddleware',
		'router',
		...
	],
	replayJwtMiddleware: require('replay-jwt-middleware')
}
```
However please note that it will apply to ALL requests.    

Alternatively, if you want a more 'fine-grained' control, this module can also be set as a policy.
This is the preferred way in my opinion:
```
module.exports.policies: {
	'MyController': {
		'*': require('replay-jwt-middleware')
	}
}
```
## Testing
There's a testing stub for this module which can be found in [replay-test-utils](https://github.com/linnovate/replay-common/tree/develop/replay-test-utils) repo.  
Just hook the stub in your testing bootstrap in the following way:  
```
var jwtMiddlewareStub = require('replay-test-utils/authorization-mock').jwtMiddlewareStub;

before(function (done) {
  sails.lift({
    // configuration for testing purposes
    environment: 'testing',
    hooks: { grunt: false },
    policies: { 'MyControlller': jwtMiddlewareStub }
  }, function (err, server) {
	  ...
	  ...
  });
```
