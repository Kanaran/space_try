var Util = require('./util');

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
    Star.list[id] = self;
    return self;
};

Star.list = {};
Star.init = function(cb) {
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

        for(var star in Star.list) {
            if(Star.list[star].getDistance({x:x, y:y, radius:radius}) < 40) {
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
    }
    cb();
}

module.exports = Star;