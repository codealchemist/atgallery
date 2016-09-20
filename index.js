var express = require('express');
var http = require('http');
var compression = require('compression');
var app = express();

app.use(compression());
app.use('/', express.static(__dirname + '/dist/app'));
app.use('/gallery/*', express.static(__dirname + '/dist/app'));
app.use('/our-picks', express.static(__dirname + '/dist/app'));
app.use('/fonts', express.static(__dirname + '/dist/fonts'));
app.use('/img', express.static(__dirname + '/dist/img'));

app.use(function(req, res){
  res.sendStatus(404);
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
