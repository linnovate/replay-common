## Description
This package is intended to share common services interactions across replay project.  
E.g. If you find yourself copying code across several microservices just to interact with another  
service, this code place is here.

You might as well add a piece of code to here just to maintain a centralized place to interact with  
another services, even if this code is used only once by you.

## Content
* authorization: Simple logic to interact with authorization service and retrieve permissions.

## Usage
For example:
```
var authorizationService = require('replay-request-services/authorization);

authorizationService.findPermissionsByUserId()...
```

## Configuration
```
Set environment variables to config the package:

| Name                          | Description                                  | Default          |
|-------------------------------|----------------------------------------------|------------------|
| AUTHORIZATION_SERVICE_HOST    | Authorization service host name              | http://localhost |
| AUTHORIZATION_SERVICE_PORT    | Authorization service host port              | 1340             |
```