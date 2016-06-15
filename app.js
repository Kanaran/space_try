/**
 * Created by niko on 09.06.16.
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('client'));
server.listen(process.env.PORT || 3000);

console.log('Server running on ' + process.env.PORT || 3000);

var Util = require('./server/util');
var Star = require('./server/star');
var Player = require('./server/player');

var SOCKET_LIST = {};

Star.init(function() {
    console.log('Stars complete');
});

io.on('connection', function (socket) {
    socket.id = Util.generateUUID();
    socket.auth = false;
    SOCKET_LIST[socket.id] = socket;
    
    Player.onConnect(socket, function(err) {
        if(err) {
            socket.emit('login', { success:false, msg:err });
        } else {
            socket.emit('login', { success:true, stars:Star.list, game_settings:Star.settings });
        }
    });

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
    });
});