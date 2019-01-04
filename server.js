//include all node dependencies
var express = require('express');
var http = require('http');
var port = process.env.PORT || 3000;


//setup the node server & socket.io
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

app.get('/', function(req, res){
	res.sendFile(__dirname+'/index.html');
});

//open a connection with socket.io
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s socket(s) connected', connections.length);

	//disconnect..
	socket.on('disconnect', function(data){
	//	if(!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUserNames();

		connections.splice(connections.indexOf(data), 1);
		console.log('Disconnected: %s socket(s) disconnected', connections.length);
	});

	//send message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//new user
	socket.on('new user', function(data, cb){
		cb(true);
		socket.username = data;
		users.push(socket.username);
		updateUserNames();
	});

	function updateUserNames(){
		io.sockets.emit('get users', users);
	}
});



//initialise the server
server.listen(port, function(err){
	if (!err) {
		console.log('Server running on port', port);
	} else {
		console.log(err);
	}
});
