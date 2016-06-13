/**
 * Created by AV01NSF on 13.06.2016.
 */
/* globals Valaran */
Valaran.Entities = (function(Valaran, undefined) {
    "use strict";

    var Stars = {};

    var Star = function (x, y, radius, color) {
        var id = Valaran.Util.generateUUID();//Math.random();
        var self = {
            x: x,
            y: y,
            radius: radius,
            color: color,
            id: id
        };

        self.getDistance = function(entity) {
            var a = self.x - entity.x;
            var b = self.y - entity.y;
            return Math.sqrt(a*a + b*b) - self.radius - entity.radius;
        };

        Stars[id] = self;
        return self;
    };

    

    return {
        Stars: Stars,
        Star: Star
    };
})(Valaran);