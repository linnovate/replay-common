## Initialization
```
PUT videometadatas
{
   "settings" : {
       "index" : {
           "number_of_shards" :5,
           "number_of_replicas" : 1
       }
   },
   "mappings": {
       "videometadata": {
            "properties": {
              "sourceId": { "type": "integer" },
              "videoId": { "type": "string" },
              "receivingMethod": { "type": "nested"},
              "timestamp": { "type": "date" },
              "sensorPosition": { "type": "geo_point" },
              "sensorTrace": { "type": "geo_shape" },
              "data": { "type": "object" }
            }
       }
    }
}
```

You can also use the [replay-db-initialization](https://github.com/linnovate/replay-common/tree/develop/replay-db-initialization) helper module instead.

Or at last, you can call the direct initialization method:
```
node -e 'require("./index").createVideoMetadataIndex()'
```

## Environment variables
```
| Name                          | Description                                  | Default        |
|-------------------------------|----------------------------------------------|----------------|
| ELASTIC_VIDEO_METADATA_INDEX  | The index of the VideoMetadata in Elastic    | videometadatas |
| ELASTIC_VIDEO_METADATA_TYPE   | The type of the VideoMetadata in Elastic     | videometadata  |
```

Host & Port are intentionally not here, because they are receieved from the activating process.
