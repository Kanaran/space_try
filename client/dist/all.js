/**
 * Created by AV01NSF on 13.06.2016.
 */
/* jshint forin: false */
/* globals Valaran, socket, Konva, toastr */
Valaran.App = (function(Valaran, socket, Konva, toastr, window, document, undefined) {
    "use strict";

    function writeMessage(message) {
        if(message !== null && message !== '')
            toastr.info(message, null, {preventDuplicates:true});
        //text.setText(message);
        //layer.draw();
    }

    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var offsetX = 80;
    var offsetY = 0;
    var inGame = false;

    var stage = new Konva.Stage({
        container: 'field',
        width: WIDTH,
        height: HEIGHT - 70
    });

    var layer = new Konva.Layer({});

    var group = new Konva.Group({
        x: 0,
        y: 0
    });

    function star_mousemove(event) {
        var color = Valaran.Entities.Stars[event.target.attrs.starId].color;
        var x = Valaran.Entities.Stars[event.target.attrs.starId].x;
        var y = Valaran.Entities.Stars[event.target.attrs.starId].y;
        writeMessage('ID: ' + event.target.attrs.starId + ', Farbe: ' + color + ', x: ' + x + ', y: ' + y);
    }

    function star_mouseout() {
        writeMessage('');
    }

    function drawStars() {
        for (var star in Valaran.Entities.Stars) {
            var circle = new Konva.Circle({
                x: Valaran.Entities.Stars[star].x + Valaran.Entities.Stars[star].radius,
                y: Valaran.Entities.Stars[star].y + Valaran.Entities.Stars[star].radius,
                radius: Valaran.Entities.Stars[star].radius,
                fill: Valaran.Entities.Stars[star].color,
                stroke: 'black',
                strokeWidth: 1,
                starId: Valaran.Entities.Stars[star].id
            })
            .on('mousemove', star_mousemove(event))
            .on('mouseout', star_mouseout);

            group.add(circle);
        }
    }

    var text = new Konva.Text({
        x: 10,
        y: 10,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: '',
        fill: 'black'
    });

    layer.add(text);
    layer.add(group);
    stage.add(layer);

    var update = function() {
    };

    var draw = function() {
    };

    var login_div = document.getElementById('login');
    var login_username = document.getElementById('username');
    var login_password = document.getElementById('password');
    var login_submit = document.getElementById('submit');
    var game_div = document.getElementById('game');

    login_submit.onclick = function() {
        socket.emit('login', {
            user:login_username.value,
            pass:login_password.value
        });
    };

    socket.on('login', function (data) {
        if(data.success) {
            Valaran.Server.game_settings = data.game_settings;
            Valaran.Entities.Stars = data.stars;
            drawStars();
            layer.draw();
            login_div.style.display = 'none';
            game_div.style.display = 'inline-block';
            inGame = true;
        } else {
            toastr.error(data.msg);
            console.log(data);
        }
    });

    var redraw = false;
    window.onresize = function() {
        if (redraw === false) {
            redraw = true;
            setTimeout(function() {
                stage.width(window.innerWidth);
                stage.height(window.innerHeight);
                layer.draw();
                redraw = false;
            }, 1000 / 2);
        }
    };

    $(document).keyup(function(ev) {
        if (!inGame) return;

        ev.preventDefault();
        Valaran.Keymap.keyup(ev.keyCode);
    });
    $(document).keydown(function(ev) {
        if (!inGame) return;

        ev.preventDefault();
        var keypressed = Valaran.Keymap.keydown(ev.keyCode);
        var posX = 0;
        var posY = 0;

        if(keypressed === 'left') {
            posX = layer.getAttr('x');
            if(posX <= -10) {
                offsetX = posX + 10;
                layer.move({
                    x: 10
                });
                layer.batchDraw();
            }            
        }
        if(keypressed === 'right') {
            posX = layer.getAttr('x');
            if(posX > window.innerWidth - Valaran.Server.game_settings.WIDTH - 10) {
                offsetX = posX - 10;
                layer.move({
                    x: -10
                });
                layer.batchDraw();
            }       
        }
        if(keypressed === 'up') {
            posY = layer.getAttr('y');
            if(posY <= -10) {
                offsetY = posY + 10;
                layer.move({
                    y: 10
                });
                layer.batchDraw();
            }            
        }
        if(keypressed === 'down') {
            posY = layer.getAttr('y');
            if(posY > window.innerHeight - Valaran.Server.game_settings.HEIGHT - 80) {
                offsetY = posY - 10;
                layer.move({
                    y: -10
                });
                layer.batchDraw();
            }       
        }
    });

    setInterval(function() {
        update();
        draw();
    }, 1000 / 25);
})(Valaran, socket, Konva, toastr, window, document);
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
/* globals Valaran */
Valaran.Keymap = (function() {
    "use strict";

    var shifting = false;
    var ctrling = false;
    var alting = false;

    var keymap = {
        8: 'backspace'
        , 9: 'tab'
        , 13: 'ret'
        , 16: 'shift'
        , 17: 'ctrl'
        , 18: 'alt'
        , 19: '?'// pause
        , 20: 'caps_lock'
        , 27: 'esc'
        , 32: 'spc'
        , 33: 'pgup'
        , 34: 'pgdn'
        , 35: 'end'
        , 36: 'home'
        , 37: 'left'
        , 38: 'up'
        , 39: 'right'
        , 40: 'down'
        , 44: 'print'
        , 45: 'insert'
        , 46: 'delete'
        , 48: '0'
        , 49: '1'
        , 50: '2'
        , 51: '3'
        , 52: '4'
        , 53: '5'
        , 54: '6'
        , 55: '7'
        , 56: '8'
        , 57: '9'
        , 59: 'semicolon'
        , 61: 'equal'
        , 65: 'a'
        , 66: 'b'
        , 67: 'c'
        , 68: 'd'
        , 69: 'e'
        , 70: 'f'
        , 71: 'g'
        , 72: 'h'
        , 73: 'i'
        , 74: 'j'
        , 75: 'k'
        , 76: 'l'
        , 77: 'm'
        , 78: 'n'
        , 79: 'o'
        , 80: 'p'
        , 81: 'q'
        , 82: 'r'
        , 83: 's'
        , 84: 't'
        , 85: 'u'
        , 86: 'v'
        , 87: 'w'
        , 88: 'x'
        , 89: 'y'
        , 90: 'z'
        , 91: 'ctrl' // left command
        , 93: 'ctrl' // right command
        , 107: 'equal'
        , 109: 'minus'
        , 112: 'f1'
        , 113: 'f2'
        , 114: 'f3'
        , 115: 'f4'
        , 116: 'f5'
        , 117: 'f6'
        , 118: 'f7'
        , 119: 'f8'
        , 120: 'f9'
        , 121: 'f10'
        , 122: 'f11'
        , 123: 'f12'
        , 144: 'num_lock'
        , 145: 'scroll_lock'
        , 186: 'semicolon'
        , 187: 'equal'
        , 188: 'comma'
        , 189: 'minus'
        , 190: 'dot'
        , 191: 'slash'
        , 192: 'apostrophe'
        , 219: 'bracket_left'
        , 220: 'backslash'
        , 221: 'bracket_right'
        , 222: '\''
        , 224: 'ctrl' // command in firefox
    };

    var keydown = function(keycode) {
        var mapping = keymap[keycode];
        if (!mapping) return null;

        if (mapping === 'shift') {
            shifting = true; return null;
        } else if (mapping === 'ctrl') {
            ctrling = true; return null;
        } else if (mapping === 'alt') {
            alting = true; return null;
        }

        var prefix = '';
        if (shifting) prefix += 'shift-';
        if (ctrling) prefix += 'ctrl-';
        if (alting) prefix += 'alt-';

        return prefix + mapping;
    };

    var keyup = function(keycode) {
        var mapping = keymap[keycode];
        
        if (mapping === 'shift') {
            shifting = false;
        } else if (mapping === 'ctrl'){
            ctrling = false;
        } else if (mapping === 'alt') {
            alting = false;
        }
    };

    return {
        keydown:keydown,
        keyup:keyup
    };
})();
/* globals Valaran */
Valaran.Server = (function() {
    "use strict";

    var Game_Settings = {};

    return {
        game_settings: Game_Settings
    };
})();
/**
 * Created by AV01NSF on 13.06.2016.
 */
/* jslint bitwise: true */
/* globals Valaran */
Valaran.Util = (function(Date, window, Math, undefined) {
    "use strict";

    var generateUUID = function (){
        var d = Date.now();
        if(window.performance && typeof window.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c==='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    return {
        generateUUID: generateUUID
    };
})(Date, window, Math);