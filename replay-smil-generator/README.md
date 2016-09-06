## smil generator

Synchronized Multimedia Integration Language (SMIL) files organize streams of various bitrates into groups for HTTP adaptive bitrate streaming. A player selects a stream in the group that's best-suited to its available bandwidth and processor power. If conditions change, the player can switch to a different stream in the group that's better-suited to the current conditions.

## Motivation

this project is a simple tool ment to prepare media contents for adaptive stream using smil files.

## Using in code

```js
var SmilGenerator = require('replay-smil-generator');
/* some other code.. */
var mySmilGen = new SmilGenerator();
```

## API Reference With Code Examples

generating a new smil file
```js
SmilGenerator.generateSmil(
{
	folderPath: 'some folder with several flavors of media',  // smil file will be generated under this path.
	smilFileName: 'file_name_wanted_for_smil',
	title: 'title for your adaptive stream',  
	video: ['array','of','file','names','with','extension',] // under specified folderPath
});
```
append more videos to existing smil // not implemented yet
```js
SmilGenerator.addVideos({
	folderPath: 'folder path of smil file and new video content',  // smil file will be generated under this path.
	smilFileName: 'smil file name', 
	video: ['array','of','file','names','with','extension',] // under specified folderPath
})
```
(e.g)
```js
var smilGen = new SmilGenerator();  
smilGen.generateSmil({  
	folderPath: '/home/Videos/BigBuckBunny',  
	smilFileName: 'BigBuckBunny.smil',
	title: 'BigBuckBunny adaptive stream',  
	video: ['BigBuckBunny_480p.mp4', 'BigBuckBunny_720p.mp4', 'BigBuckBunny_1080p.mp4']  
});
```

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
