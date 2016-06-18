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

    var star_mousemove = function (event) {
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
            .on('mousemove', star_mousemove)
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