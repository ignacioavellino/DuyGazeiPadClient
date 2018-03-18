var express = require('express');
var http        = require("http");
var path = require('path');
var WebSocket   = require("ws");

// Create server
var app = express();
var server = http.createServer(app);

var WebSocketServer   = WebSocket.Server;

var webServerPort = 8080; // Web server (http) listens on this port

app.set('port', process.env.PORT || webServerPort);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'views')));

server.listen(app.get('port'),function() {
    console.log("Web Server listening port " + app.get('port'));
});

// Web socket server
const wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: true
});

//CLIENTS=[];
clientIds = 0;

/*----------- WS Server -----------*/

// const wss = new WebSocket.Server({ port: webSocketServerPort },function(){
//   console.log("WS Server listenting on " + webSocketServerPort);
// });

wss.on('connection', function connection(ws, req) {
	ws.id = clientIds;
	clientIds++;

//	CLIENTS.push(ws);
	console.log("Someone connected, assigning id: " + ws.id);

	ws.on('message', function incoming(message) {
		console.log('Received message from ' + ws.id + ': ' + message);
	    //var msg = JSON.parse(message);
		// Broadcast message to everyone
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log("Broadcasting received message");
            client.send(message);
          }
        });
	});

  //ws.send('something');
});
/*----------- WS Server -----------*/

