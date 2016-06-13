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

var SOCKET_LIST = {};
var STAR_LIST = {};

var Star = function(x, y, radius, color) {
    var id = Util.generateUUID();
    var self = {
        id: id,
        x: x,
        y: y,
        radius: radius,
        color: color
    };

    self.getDistance = function(entity) {
        var a = self.x - entity.x;
        var b = self.y - entity.y;
        return Math.sqrt(a*a + b*b) - self.radius - entity.radius;
    };
    STAR_LIST[id] = self;
    return self;
};

var WIDTH = 2000;
var HEIGHT = 800;
var Colors = ['red', 'blue', 'green', 'yellow', 'white', 'purple', 'orange'];
var i = 0;
while (i < 200) {
    var radius = 3 + Math.round(Math.random()*5);

    var x = Math.round(Math.random() * WIDTH);
    if (x < 5 + radius) {
        x = 5 + radius;
    }
    var y = Math.round(Math.random() * HEIGHT);
    if (y < 50 + radius) {
        y = 50 + radius;
    }

    var ok = true;

    for(var star in STAR_LIST) {
        if(STAR_LIST[star].getDistance({x:x, y:y, radius:radius}) < 40) {
            ok = false;
        }
    }
    if (ok === true) {
        var color = Colors[Math.round(Math.random()*6)];
        Star(x, y, radius, color);
        i++;
    } else {
        ok = true;
    }
    console.log(i);
}

console.log('Stars complete');

io.on('connection', function (socket) {
    socket.id = Util.generateUUID();
    socket.offsetX = 0;
    socket.offsetY = 0;
    SOCKET_LIST[socket.id] = socket;
    
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
    });

    socket.emit('stars', STAR_LIST);
    socket.on('my other event', function (data) {
        console.log(data);
    });
});