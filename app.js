var express = require('express')
  , http = require('http')
  , path = require('path')
  , WebSocketServer = require('ws').Server;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
var wsserver = new WebSocketServer({
  'server': server,
  'path': '/'
});

var conns = [];

wsserver.on('connection', function(ws) {
  conns.push(ws);
  ws.on('message', function(message) {
    conns.forEach(function(conn) {
        try {
          if (conn !== ws) {
            conn.send(message);
          }
        } catch(e) {
        }
    });
  });
  ws.on('close', function() {
    conns.splice(conns.indexOf(ws), 1);
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
