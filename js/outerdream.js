/*
    Title:      Outer Dream JavaScript
    Author:     Andrew Mason
    Contact:    a.w.mason@gmail.com
    URL:        http://coderonfire.com/

    TODO:
        * Add progressive enhancement checks

    Copyright:
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Outer Dream is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Outer Dream.  If not, see <http://www.gnu.org/licenses/>.

 */

var outerdream = (function() {
    var tileSize = 16;
    var tileRows = 20;
    var tileColumns = 30;
    var viewport = {
        xpos: 0,
        ypos: 0
    };
    var player = {
        xpos: 0,
        ypos: 0
    };
    var fps = 30;
    var spriteTilesSrc = 'images/spites.png';

    var init = function() {
        // Create main game canvas
        canvas = document.getElementById('gameCanvas');
        context = this.canvas.getContext('2d');
        width = this.canvas.width;
        height = this.canvas.height;
        spriteTiles = new Image();
        spriteTiles.src = spriteTilesSrc;

        // Wait till image has finished loading
        spriteTiles.onload = function() {
            // Strange performance boost by doing this!?
            context.drawImage(spriteTiles, 0, 0);
            draw();
        }

        // Handle key events
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    };

    var gameLoop = function() {
        if (moving) {
            move();
            draw();
        }
    };

    var draw = function() {
        console.time('drawing canvas');
        // Initialise some variables for later use
        var colour = 0;
        var source = {};

        // Loop through each tile position
        for (var row = 0; row < tileRows; row++) {
            for (var col = 0; col < tileColumns; col++) {
                // Choose tile based on tilemap value
                if (tileMap[row][col] == 1) {
                   source.x = 34;
                   source.y = 22;
                } else {
                    source.x = 0;
                    source.y = 0;
                }
                // Calculate the tile destination
                var destX = col * tileSize + viewport.xpos;
                var destY = row * tileSize + viewport.ypos;
                // Draw a portion of a the tileSprite to the canvas
                context.drawImage(spriteTiles, source.x, source.y, tileSize, tileSize, destX, destY, tileSize, tileSize);
            }
        }

        console.timeEnd('drawing canvas');
    };

    var movePlayer = function(direction) {
        switch (direction) {
            case 'left':
                player.xpos--;
                break;
            case 'right':
                player.xpos++;
                break;
            case 'up':
                player.ypos--;
                break;
            case 'down':
                player.ypos++;
                break;
        }

        // Flag that we are moving
        moving = true;
    };

    var handleKeyDown = function(event) {
        // Detect what key was pressed (support wasd & arrows)
        switch (event.keyCode) {
            case 37:
            case 65:
                movePlayer('left');
                break;
            case 38:
            case 87:
                movePlayer('up');
                break;
            case 39:
            case 68:
                movePlayer('right');
                break;
            case 40:
            case 83:
                movePlayer('down');
                break;
        }
    };

    var handleKeyUp = function(event) {
        moving = false;
    };

    var tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // Run
    init();
})();
