var Base = require('./base');

var Player = function(name) {
    var self = Base();
    self.name = name;
    self.offsetX = 0;
    self.offsetY = 0;

    Player.list[self.id] = self;
    return self;
}

Player.list = {};

Player.onConnect = function(socket, cb) {
    socket.on('login', function(data) {
        console.log(data);
        if(data.user === 'bob' && data.pass === 'asd') {
            var player = Player(data.user);
            socket.auth = true;
            socket.playerID = player.id;
            cb();
        } else {
            cb('login failed');
        }
    });
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
} 

module.exports = Player;