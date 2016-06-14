/**
 * Created by AV01NSF on 13.06.2016.
 */
/* globals Valaran, Konva */
Valaran.App = (function(Valaran, socket, Konva, window, document, undefined) {
    "use strict";

    function writeMessage(message) {
        text.setText(message);
        layer.draw();
    }

    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    var stage = new Konva.Stage({
        container: 'game',
        width: WIDTH,
        height: HEIGHT
    });

    var layer = new Konva.Layer({});

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
            });

            circle.on('mousemove', function(event) {
                var color = Valaran.Entities.Stars[event.target.attrs.starId].color;
                var x = Valaran.Entities.Stars[event.target.attrs.starId].x;
                var y = Valaran.Entities.Stars[event.target.attrs.starId].y;
                writeMessage('ID: ' + event.target.attrs.starId + ', Farbe: ' + color + ', x: ' + x + ', y: ' + y);
            });

            circle.on('mouseout', function(event) {
                writeMessage('');
            });


            layer.add(circle);
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
            Valaran.Entities.Stars = data.stars;
            drawStars();
            layer.draw();
            login_div.style.display = 'none';
            game_div.style.display = 'inline-block';
        } else {
            //TODO: Toast
            console.log(data);
        }
    });

    var redraw = false;
    window.onresize = function(event) {
        if (redraw === false) {
            redraw = true;
            setTimeout(function() {
                stage.width(window.innerWidth);
                stage.height(window.innerHeight);
                layer.draw();
                redraw = false;
            }, 1000 / 2);
        }
    }

    setInterval(function() {
        update();
        draw();
    }, 1000 / 25);
})(Valaran, socket, Konva, window, document);