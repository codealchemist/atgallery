var express = require('express');
var http = require('http');
var gzippo = require('gzippo');

var app = express();
app.use(gzippo.staticGzip('' + __dirname + '/dist/'));
app.use('/*', function(req, res){
  res.sendFile(__dirname + '/dist/');
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
