# youtube-mp3

Download the audio from [Youtube](https://youtube.com) videos as mp3 file. This module uses [youtube-mp3.org](http://www.youtube-mp3.org/) for the conversion.

## Usage

```javascript
var mp3 = require('youtube-mp3');

mp3.download('https://www.youtube.com/watch?v=bRmSMdQnfAc', 'LXJS 2013 Keynote', function(err) {
    if(err) return console.log(err);
    
    console.log('Download completed!');
});
```
