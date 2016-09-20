var express = require('express');
var http = require('http');
var compression = require('compression');
var app = express();
var port = process.env.PORT || 5000;

app.use(compression());
app.use(express.static(__dirname + '/dist/app/'));
app.use('/fonts', express.static(__dirname + '/dist/fonts'));
app.use('/img', express.static(__dirname + '/dist/img'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/app/');
});

app.use(function(req, res){
  res.sendStatus(404);
});

var server = http.createServer(app);
server.listen(port);
console.info(`
--- server started on port ${port}
`);
