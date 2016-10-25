## Description
A middleware for Sails.js which sets req.userId to the user's ID taken from the Json Web Token in the  
Authorization request header.  

## Setup
A secret is required in order to decode the JWT, so make sure to have it configured in  
`sails.config.settings.token_secret`.

## Usage
Set this module as middleware in your app:
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

Alternatively, this module can also be set as a policy.