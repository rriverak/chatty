var express = require('express');
var socket = require('socket.io');

var app = express();
var io = socket.listen(3333)
var http = require('http').Server(app);
var users = [];
var userSockets = {};

http.listen(81, function(){
  console.log('WebServer listening on *:81');
});

app.use(express.static(__dirname + '/ionChatty/www/'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/ionChatty/www/index.html');
});

io.on('connection', function(client){
  console.log('User Connected -> ' + client.id);

  client.on("login", function(name){
    var user = {};
    user.Name = name;
    user.Id = client.id;

    userSockets[client.id] = client;
    users.push(user);
    io.sockets.emit("update", users);
  });

  client.on("send", function(fromUser, toUser, msg){
    console.log('From -> ' + fromUser + ' To -> ' + toUser + ' Message: ' + msg);
    userSockets[toUser].emit("incomming", fromUser , msg);
  });

  client.on("disconnect", function(){
      console.log('User Disconnected -> ' + client.id);
      var index = users.map(function(e) { return e.Id; }).indexOf(client.id);
      if(index > -1 ){
        users.splice(index,1);
      }

      delete userSockets[client.id];
      io.sockets.emit("update", users);
  });

});
