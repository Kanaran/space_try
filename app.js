/**
 * Created by niko on 09.06.16.
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('client'));
server.listen(3000);

var Util = require('./server/util');
var Star = require('./server/star');

var SOCKET_LIST = {};

Star.init(function() {
    console.log('Stars complete');
});

io.on('connection', function (socket) {
    socket.id = Util.generateUUID();
    socket.offsetX = 0;
    socket.offsetY = 0;
    SOCKET_LIST[socket.id] = socket;
    
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
    });

    socket.emit('stars', Star.list);
});