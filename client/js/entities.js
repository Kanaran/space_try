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

    var Colors = ['red', 'blue', 'green', 'yellow', 'white', 'purple', 'orange'];
    var i = 0;
    while (i < 200) {
        var radius = 3 + Math.round(Math.random()*5);

        var x = Math.round(Math.random() * window.innerWidth - 5 - radius * 2);
        if (x < 5 + radius) {
            x = 5 + radius;
        }
        var y = Math.round(Math.random() * window.innerHeight - 5 - radius * 2);
        if (y < 50 + radius) {
            y = 50 + radius;
        }

        var ok = true;

        for(var star in Stars) {
            if(Stars[star].getDistance({x:x, y:y, radius:radius}) < 50) {
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

    return {
        Stars: Stars,
        Star: Star
    };
})(Valaran);