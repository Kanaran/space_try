/**
 * Created by AV01NSF on 13.06.2016.
 */
/* globals Valaran, Konva */
Valaran.App = (function(Valaran, socket, Konva, window, undefined) {
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

    socket.on('stars', function (data) {
        Valaran.Entities.Stars = data;
        drawStars();
        layer.draw();
    });

    var update = function() {
    };

    var draw = function() {
    };

    socket.on('connect', function (data) {
        
    });

    setInterval(function() {
        update();
        draw();
    }, 1000 / 25);
})(Valaran, socket, Konva, window);