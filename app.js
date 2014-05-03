var express = require('express')
  , http = require('http')
  , path = require('path')
  , morgan = require('morgan')
  , errorHandler = require('errorhandler')
  , WebSocketServer = require('ws').Server;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
var wsserver = new WebSocketServer( {
  'server': server,
  'path': '/'
});

var conns = [];
wsserver.on('connection', function(ws) {
  conns.push({
     socket: ws
    ,roomname: 'default'
  });
  ws.on('message', function(message) {
    conns.forEach(function(conn) {
      try {
        var jsonMessage = JSON.parse(message);
        if (conn.socket === ws && conn.roomname != jsonMessage.roomname) {
          conn.roomname = jsonMessage.roomname;
        }
        if (conn.roomname == jsonMessage.roomname) {
          conn.socket.send(message);
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
