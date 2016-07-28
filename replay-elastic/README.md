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


## Environment variables

```
ELASTIC_VIDEO_METADATA_INDEX
ELASTIC_VIDEO_METADATA_TYPE
```

Host & Port are explicitly not here, because they depend on the activating process.
