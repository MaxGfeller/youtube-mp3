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

  var pingLink = 'http://ping.aclst.com/ping.php/12790944/{0}';

  var downloadLink = '/get?ab=256&video_id={0}&h={1}&r={2}';

  var _cc = function(a) {
    var __AM = 65521;
    if ("string" != typeof a) throw Error("se");
    var c = 1,
        b = 0,
        d, e;
    for (e = 0; e < a.length; e++) d = a.charCodeAt(e), c = (c + d) % __AM, b = (b + c) % __AM;
    return b << 16 | c
  }

  /**
   * Push the item to their API
   **/
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

  /**
   * Get the item info link
   **/
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

  /**
   * Ping the item on the aclst.com service
   **/
  var pingItem = function(token, reqBody, cb) {
   if(reqBody.indexOf('info') !== 0) return cb('Fail from api: ' + reqBody);

   eval(reqBody);

   http.get(info.pf, function(res) {
    cb(null, token, info);
   }).on('error', function(e) {
     return cb(e.message);
   });
  }

  /**
   * Download the file
   **/
  var downloadFile = function(token, info, cb) {
    var timestamp = (new Date).getTime();

    var options = {
      path: downloadLink.replace('{0}', token).
        replace('{1}', info.h).
        replace('{2}', timestamp + '.' + _cc(token + timestamp)),
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
      pingItem.bind(this),
      downloadFile.bind(this),
      function done(err) {
        finalCallback(err);
      });
}

module.exports = downloader;
