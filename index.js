var http = require('follow-redirects').http;
var test = require('net');
var urlencode = require('urlencode');
var runnel = require('runnel');
var fs = require('fs');

var downloader = {};

downloader.host = 'www.youtube-mp3.org';
downloader.baseLink = 'http://' + downloader.host;

downloader.download = function(youtubeLink, filename, finalCallback) {
  var pushItemLink = this.baseLink + '/a/pushItem' +
    '/?item=' + urlencode(youtubeLink) + 
    '&el=na&bf=false';

  var itemInfoLink = this.baseLink + '/a/itemInfo' +
    '/?video_id={0}&ac=www&t=grp';

  var downloadLink = '/get?video_id={0}&h={1}';

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
    if(reqBody.indexOf('info') !== 0) {
      cb(reqBody);
      return;
    }
    eval(reqBody);

    var options = {
      path: downloadLink.replace('{0}', token).replace('{1}', info.h),
      host: this.host,
      agent: false
    };

    var req = http.get(options, function(res) {
      var writeFile = fs.createWriteStream(filename, {'flags': 'a'});
      res.on('data', function(chunk) {
        writeFile.write(chunk, encoding='binary');
      });

      res.on('end', function() {
        writeFile.end();
        cb(null);
      });
    }).on('error', function(e) {
      cb(e);
    });
  }

  runnel(
      pushItem,
      getItemInfo,
      downloadFile.bind(this),
      function done(err) {
        finalCallback(err);
      });
}

module.exports = downloader;
