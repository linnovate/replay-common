## Description

This module is responsible for handling all the job types performed in replay's RabbitMQ.

Internally, it holds a config file in /queues_config which maps between job name, it's queue, and the service in replay's [consumer](https://github.com/linnovate/replay-infra/tree/develop/consumer) who handles this job.

New jobs can be easily added by expanding the config file in /queues_config.

## Jobs

| Name                   | Description                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| SaveVideo              | Saves a Video object to Mongo, if we receieved one.                                                                                |
| MetadataParser         | Parses the received metadatas to VideoMetadata objects with a special parser per video standard & version.                         |
| MetadataToMongo        | Bulk inserts VideoMetadata objects to Mongo.                                                                                       |
| MetadataToElastic      | Bulk inserts VideoMetadata objects to Elastic.                                                                                     |
| VideoBoundingPolygon   | Creates a convex hull bounding polygon from all the video's metadatas sensor trace polygons and update the Video.                  |
| MetadataToCaptions     | Create caption files from the metadatas.                                                                                           |
| CaptionsToDestination  | Copy caption files to their destination (e.g. certain folder).                                                                     |
| AttachVideoToMetadata  | Find the Video ID for VideoMetadata objects without a Video ID (in demuxed standard where video and it's meatdatas are separated). |
| UploadVideoToProvider  | Handling the upload process to the video provider.                                                                                 |
| FetchVideoFromProvider | Handling the fetch process to the video provider, after an upload is completed.                                                    |

