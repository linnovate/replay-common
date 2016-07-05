## Purpose

The purpose of this module is to hold and share all the Waterline schemas across the app.

## Usage

If using Sails.js, create an appropriate Model under /api/models, for example Video, and then:
```
var Video = require('replay-schemas/Video');

module.exports = Video;
```

If using plain Node.js, make sure to call:
```
waterlineConfig()
.then(...)
```
At the beginning of your code, and it will fully initialize Waterline within your process.


Access to the models is achieved via:
```
global.models.<model-name>
```
