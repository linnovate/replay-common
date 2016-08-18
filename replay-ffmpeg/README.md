# replay-ffmpeg-service

replay-ffmpeg-service is module that export some useful methods for record videos and manipulation on TS files.
It uses Behind the Scenes the fluent-ffmpeg module.

###Install

1. Install ffmpeg and ffprobe on ubuntu through this [guide](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).
2. run the command:
`npm install --save replay-ffmpeg`

###Methods

for using the methods first require the module

`var ffmpeg = require('replay-ffmpeg-service');`

#####ffmpeg.captureMuxedVideoTelemetry(params)

record video and extract his data/extract data from ts file in the file system.

* `params` | `<Object>`
  * `duration` | `<Number>` **required** time limit for the extracting data.
  * `file` | `<String>` **required** name of the file that will be create.
  * `dir` | `<String>` **required** path for the file to be create.
  * `inputs` | `<Array>` **required** String Array of the inputs, cand be path to video from file system or stream brodcast host *(note: if the input is stream brodcast host make sure it in this pattern: 'udp://[ip]:[port]')*.

* Return `command` | `<Object>` command object.

___

#####ffmpeg.captureVideoWithoutTelemetry(params)

record video/copy video in the file system.

* `params` | `<Object>`
  * `duration` | `<Number>` **required** time limit for the extracting data.
  * `file` | `<String>` **required** name of the file that will be create.
  * `dir` | `<String>` **required** path for the file to be create.
  * `inputs` | `<Array>` **required** String Array of the inputs, cand be path to video from file system or stream brodcast host *(note: if the input is stream brodcast host make sure it in this pattern: 'udp://[ip]:[port]')*.

* Return `command` | `<Object>` command object.

___

#####ffmpeg.captureTelemetryWithoutVideo(params)

record data/extract data from ts file in the file system.

* `params` | `<Object>`
  * `duration` | `<Number>` **required** time limit for the extracting data.
  * `file` | `<String>` **required** name of the file that will be create.
  * `dir` | `<String>` **required** path for the file to be create.
  * `inputs` | `<Array>` **required** String Array of the inputs, cand be path to video from file system or stream brodcast host *(note: if the input is stream brodcast host make sure it in this pattern: 'udp://[ip]:[port]')*.

* Return `command` | `<Object>` command object.

___

#####captureMuxedVideoTelemetry | captureVideoWithoutTelemetry | captureTelemetryWithoutVideo

* emit 'FFmpegBegin' when begin the process.
* emit 'FFmpegFirstProgress' when the "fluent-ffmpeg" "progress" event emit in the first time.
* emit 'FFmpegDone' when the process finish his job.
* emit 'FFmpegError' when error eccured in the process.

___

#####ffmpeg.convertMpegTsFormatToMp4(params)

convert ts file from file system to mp4 format.
It take the file with the suffix '.ts' and create new file at the same path and with the same name just with the suffix '.mp4'

* `params` | `<Object>`
  * `filePath` | `<String>` the path of the file with the file name.

* emit 'FFmpegWrapper_errorOnConverting' when error eccured on converting.
* emit 'FFmpegWrapper_finishConverting' when finish the converting.

___

#####ffmpeg.duration(params[,callBack])

get the duration of video.

* `params` | `<Object>`
  * `filePath` | `<String>` the path of the file with the file name.
* `callBack (optional)` | `<Function>` The callback gets two arguments `(err, duration)`.

* Return `Promise` | `<BlueBird Promise>` `.then(durtion)` | `.catch(err)`

you can see that the function work both with promise or callback, that means it Asynchronous.

___

*note: this package will be change*
