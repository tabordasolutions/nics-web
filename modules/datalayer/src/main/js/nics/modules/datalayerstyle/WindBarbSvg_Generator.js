define(['jquery'], function($){
    var path, speed, direction, trigDirection, scale, ten, five, fifty, widget;
    var SVGNS = 'http://www.w3.org/2000/svg';
    function WindArrow(Speed, Direction, Container, ArrowWidth) {
        'use strict';
        var index = 0, i;

        speed = Speed;
        direction = Direction;
        trigDirection = direction + 90;
        scale = ArrowWidth / 8;

        ten = 0;
        five = 0;
        fifty = 0;


        // Create the canvas
        $(Container).append(
            $(document.createElementNS(SVGNS, 'svg'))
                .attr({
                    xmlns: SVGNS,
                    height: 2 * ArrowWidth,
                    width: 2 * ArrowWidth
                })
        );
        $("svg", Container).append(document.createElementNS(SVGNS, 'defs'));
        $("defs", Container).append($(document.createElementNS(SVGNS, 'clipPath')).attr('id', 'clip'));
        $("clipPath", Container).append($(document.createElementNS(SVGNS, 'rect'))
            .attr({
                height: 2 * ArrowWidth,
                width: 2 * ArrowWidth
            }));

        // Draw the widget area
        $("svg", Container).append($(document.createElementNS(SVGNS, 'g')).attr('class', 'wind-arrow'));

        widget = $("svg", Container);

        if (speed > 0) {
            // Prepare the path
            path = "";
            if (speed <= 7) {
                // Draw a single line
                longBar();
                index = 1;
            } else {
                shortBar();
            }

            // Find the number of lines in function of the speed
            five = Math.floor(speed / 5);
            if (speed % 5 >= 3) {
                five += 1;
            }

            // Add triangles (5 * 10)
            fifty = Math.floor(five / 10);
            five -= fifty * 10;
            // Add tenLines (5 * 2)
            ten = Math.floor(five / 2);
            five -= ten * 2;

            // Draw first the triangles
            for (i = 0; i < fifty; i++) {
                addFifty(index + 2 * i);
            }
            if (fifty > 0) {
                index += 2 * (fifty - 0.5);
            }

            // Draw the long segments
            for (i = 0; i < ten; i++) {
                addTen(index + i);
            }
            index += ten;

            // Draw the short segments
            for (i = 0; i < five; i++) {
                addFive(index + i);
            }

            path += "Z";

            // Add to the widget

            widget.append(document.createElementNS(SVGNS, 'g'));

            $("g", widget).append($(document.createElementNS(SVGNS, 'path')).attr({
                'd': path,
                'vector-effect': 'non-scaling-stroke',
                'transform': 'translate(' + ArrowWidth + ', ' + ArrowWidth + ') scale(' + scale + ') rotate(' + trigDirection + ' ' + 0 + ' ' + 0 + ')  translate(-8, -2)',
                'class': 'wind-arrow'
            }));
        }
        $("svg", Container).append('<circle class="wind-arrow"   cx="40" cy="40" r="5"/>');
        $("svg", Container).append('<style>.wind-arrow {stroke: black;}</style>');

    }

    function shortBar() {
        // Draw an horizontal short bar.
        'use strict';
        path += "M1 2 L8 2 ";
    }

    function longBar() {
        // Draw an horizontal long bar.
        'use strict';
        path += "M0 2 L8 2 ";
    }
    function addTen(index) {
        // Draw an oblique long segment corresponding to 10 kn.
        'use strict';
        path += "M" + index + " 0 L" + (index + 1) + " 2 ";
    }
    function addFive(index) {
        // Draw an oblique short segment corresponding to 10 kn.
        'use strict';
        path += "M" + (index + 0.5) + " 1 L" + (index + 1) + " 2 ";
    }
    function addFifty(index) {
        // Draw a triangle corresponding to 50 kn.
        'use strict';
        path += "M" + index + " 0 L" + (index + 1) + " 2 L" + index + " 2 L" + index + " 0 ";
    }
    function getWindArrowSvg(speed, direction, arrowWidth) {
        var $container = $('<div>', {id: "barbcontainer"});
        WindArrow(speed, direction, $container, arrowWidth);
        return $container.html();
    }

    return {
        WindArrow: WindArrow,
        GetWindArrowSvg: getWindArrowSvg
    }
});

