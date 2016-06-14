var Base = require('./base');

var Entity = function(x,y) {
    var self = Base();
    self.x = x;
    self.y = y;

    self.getDistance = function(entity) {
        var a = self.x - entity.x;
        var b = self.y - entity.y;
        return Math.sqrt(a*a + b*b);
    };

    return self;
}

module.exports = Entity;