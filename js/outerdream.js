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
    // Create main game canvas
    canvas = document.getElementById('gameCanvas');
    context = this.canvas.getContext('2d');
    width = this.canvas.width;
    height = this.canvas.height;

    // Initialise all the game variables
    var tiles = {
        size: 16
    };

    var viewport = {
        rows: height / tiles.size,
        columns: width / tiles.size,
        tileX: -2,
        tileY: -3
    };

    var player = {
        direction: 'down',
        tileX: Math.floor(viewport.columns / 2),
        tileY: Math.floor(viewport.rows / 2),
        posX: Math.floor((viewport.columns / 2) * tiles.size),
        posY: Math.floor((viewport.rows / 2) * tiles.size)
    }

    var targetFPS = 30;
    var fps = 0;
    var spriteTilesSrc = 'images/spites.png';
    var charSpriteSrc = 'images/character_sprites.png';
    var moving = false;

    var init = function() {
        tiles.rows = map.length;
        tiles.columns = map[0].length;

        // Load images
        charSprite = new Image();
        charSprite.src = charSpriteSrc;

        spriteTiles = new Image();
        spriteTiles.src = spriteTilesSrc;

        // Wait till image has finished loading
        spriteTiles.onload = function() {
            debugMsg('Images loaded');
            // Strange performance boost by doing this!?
            context.drawImage(spriteTiles, 0, 0);
            context.drawImage(charSprite, 0, 0);
            gameLoop();
            //setInterval(gameLoop, 30 / 1000);
        }

        // Handle key events
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    };

    // The main game loop that controls movement and updating the canvas
    var gameLoop = function() {
        drawBackground();
        drawCharacter();
    };
    
    var scripts = {
        'hello': 'Hello World!'
    };

    var drawCharacter = function() {
        var direction = playerSprites[player.direction];
        context.drawImage(
            charSprite,
            direction[0],
            direction[1],
            tiles.size,
            tiles.size,
            player.posX,
            player.posY,
            tiles.size,
            tiles.size
        );
    }

    var drawBackground = function() {
        //console.time('drawing canvas');
        // Loop through each viewport tile
        for (var row = 0; row < viewport.rows; row++) {
            for (var col = 0; col < viewport.columns; col++) {
                // Calculate viewport position on tile map
                var x = col + viewport.tileX;
                var y =  row + viewport.tileY;

                // Check if viewport is outside tile map
                if (x < 0 || x >= tiles.columns || y < 0 || y >= tiles.rows) {
                    tile = {
                        background: 'outbounds',
                        foreground: false,
                        collision: true
                    };
                } else {
                    tile = map[y][x];
                }

                // Render background
                var spritePos = tileBackgrounds[tile.background];
                drawTile(spriteTiles, col, row, spritePos);

                // Check if the tile has a forground object and render
                if (tile.foreground) {
                    spritePos = tileForegrounds[tile.foreground];
                    drawTile(spriteTiles, col, row, spritePos);
                }
            }
        }

        // output debug information
        debugStats();

        //console.timeEnd('drawing canvas');
    };

    var drawTile = function(image, row, col, tile) {
        var destX = row * tiles.size;
        var destY = col * tiles.size;

        // Draw a portion of a the tileSprite to the canvas
        context.drawImage(
            image,
            tile[0],
            tile[1],
            tiles.size,
            tiles.size,
            destX,
            destY,
            tiles.size,
            tiles.size
        );
    }

    // Image sprite position look-up tables
    var tileBackgrounds = {
        dirt: [16, 16],
        outbounds: [0, 0]
    };

    var tileForegrounds = {
        rock: [0, 16],
        flower: [0, 32]
    };

    var playerSprites = {
        down: [0, 32],
        up: [0, 0],
        left: [0, 48],
        right: [0, 16]
    };

    // Move the position of the player
    var move = function(direction) {
        // Rough collision detection code
        // tiles around players position
        
        // Move map based on key input
        switch (direction) {
            case 'left':
                isCollision(-1, 0);
                break;
            case 'right':
                isCollision(1, 0);
                break;
            case 'up':
                isCollision(0, -1);
                break;
            case 'down':
                isCollision(0, 1);
                break;
        }
        // Update the players direction
        player.direction = direction;
        // run the game loop
        gameLoop();
    };
    
    var isCollision = function(x, y) {
        // Get next tile based on user movement
        var mapX = (player.tileX + viewport.tileX) + x;
        var mapY = (player.tileY + viewport.tileY) + y;
        var nextTile = map[mapY][mapX];
        
        // Check for scripted event       
        if (nextTile.script !== undefined) {
            alert(scripts[nextTile.script]);
        }
        
        
        // Check for collision
        if (nextTile == 'undefinded' || nextTile.collision == true) {
            // We hit something
            return
        }
        
        // We can move so update viewport position
        viewport.tileX += x;
        viewport.tileY += y;
        
    }

    var handleKeyDown = function(event) {
        // Detect what key was pressed (support wasd & arrows)
        switch (event.keyCode) {
            case 37:
            case 65:
                move('left');
                break;
            case 38:
            case 87:
                move('up');
                break;
            case 39:
            case 68:
                move('right');
                break;
            case 40:
            case 83:
                move('down');
                break;
        }
    };

    var handleKeyUp = function(event) {
        // Need to match keyup keyCode to currently moving direction
        moving = false;
    };

    // Output debug information to the screen
    var debugStats = function() {
        // Background box
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, 200, 75);
        context.fillStyle = 'rgb(255, 255, 255)';
        // Set font and text
        context.font = '9pt monospace';
        context.fillText('DEBUG CONSOLE', 10, 15);
        context.fillText('FPS = ' + fps, 10, 25);
        context.fillText('Viewport xpos = ' + viewport.tileX, 10, 35);
        context.fillText('Viewport ypos = ' + viewport.tileY, 10, 45);
        //context.fillText('Player xpos = ' + player.xpos, 10, 55);
        //context.fillText('Player ypos = ' + player.ypos, 10, 65);
        context.fill();
    }

    var debugMsg = function(msg) {
        var output = document.getElementById('debug');
        var text = document.createTextNode(msg + '\n');
        //p.appendChild(text);
        output.appendChild(text);
    }

    // Run
    init();

})();
