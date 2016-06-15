var Entity = require('./entity');

var Star = function(x, y, radius, color) {
    var self = Entity(x, y);
    self.radius = radius;
    self.color = color;

    var super_getDistance = self.getDistance;
    self.getDistance = function(entity) {
        var distance = super_getDistance(entity);
        return distance - self.radius - entity.radius;
    }
    
    Star.list[self.id] = self;
    return self;
};

Star.settings = {
    WIDTH: 2000,
    HEIGHT: 2000
}
Star.list = {};
Star.init = function(cb) {
    var Colors = ['red', 'blue', 'green', 'yellow', 'white', 'purple', 'orange'];
    var i = 0;
    while (i < 500) {
        var radius = 3 + Math.round(Math.random()*5);
        var x = Math.round(Math.random() * Star.settings.WIDTH);
        var y = Math.round(Math.random() * Star.settings.HEIGHT);
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