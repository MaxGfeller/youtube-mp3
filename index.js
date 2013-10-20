var http = require('follow-redirects').http;
var test = require('net');
var urlencode = require('urlencode');
var runnel = require('runnel');
var fs = require('fs');

var downloader = {};

downloader.baseLink = 'http://www.youtube-mp3.org';

downloader.download = function(youtubeLink, filename) {
  var pushItemLink = this.baseLink + '/a/pushItem' +
    '/?item=' + urlencode(youtubeLink) + 
    '&el=na&bf=false';

  var itemInfoLink = this.baseLink + '/a/itemInfo' +
    '/?video_id={0}&ac=www&t=grp';

  var downloadLink = this.baseLink + '/get?video_id={0}&h={1}';

  var pushItem = function(cb) {
    http.get(pushItemLink, function(res) {
      res.setEncoding('utf8');
      var body = '';

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        cb(null, body);
      });
    });
  }

  var getItemInfo = function(token, cb) {
    http.get(itemInfoLink.replace('{0}', token), function(res) {
      res.setEncoding('utf8');
      var body = '';

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        cb(null, token, body);
      });
    });
  }

  var downloadFile = function(token, reqBody, cb) {
    eval(reqBody);
    http.get(downloadLink.replace('{0}', token).replace('{1}', info.h), function(res) {
      var writeFile = fs.createWriteStream(filename, {'flags': 'a'});

      var body = '';
      res.on('data', function(chunk) {
        writeFile.write(chunk, encoding='binary');
      });

      res.on('end', function() {
        console.log('end');
        writeFile.end();
        cb(null, 'Successfully downloaded song');
      });
    });
  }

  runnel(pushItem, getItemInfo, downloadFile, console.log);
}

module.exports = downloader;
