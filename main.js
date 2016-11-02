var can_vPort = document.getElementById('viewport'),
    /* Viewport canvas */
    can_pCanvas = document.getElementById('player'),
    /* Player canvas */
    grid = { 'width': 60, 'height': 60 },
    /* This is in tiles not in pixels */
    tile = { 'width': 64, 'height': 64 },

    viewPort = { 'width': 640, 'height': 640 },
    /* Create world canvas */
    can_world = createElement('canvas', {
        'width': 3840,
        'height': 3840
    }),
    cursor = { /* Arrow keys */
        'rightPressed': false,
        'leftPressed': false,
        'downPressed': false,
        'upPressed': false
    },
    img = {},
    /* This is where all images are saved */
    sprites = {}; /* This is where all sprites are placed */

var ctx_vPort = can_vPort.getContext('2d'),
    /* Viewport canvas context */
    ctx_pCanvas = can_pCanvas.getContext('2d'),
    /* Player canvas context */
    ctx_world = can_world.getContext('2d'); /* World canvas context */

function createElement(ele, attrObj) {
    /* Create the new Element */
    var element = document.createElement(ele);

    /* Do the following only if attrObj exists */
    if (attrObj) {
        /* Loop through attrObj's properties to set the element's attributes */
        for (var i in attrObj) {
            element.setAttribute(i, attrObj[i]);
            /* attrObj's format:
                {
                    'attribute name': "Attribute's value"
                }
            */
        }
    }

    /* Return the new element */
    return element;
}

function init(key, assets) {
    /* Begin handling key presses */
    document.onkeydown = keyDownHandler;
    document.onkeyup = keyUpHandler;

    /* Load assets. This is very simple, to save time. */
    for (var i = 0, len = assets.length; i < len; i++) {
        var image = new Image();
        if (i !== len - 1) { /* If this isn't the last iteration */
            var str = key[i];
            image.onload = function() {
                // console.log(str)
                img[str] = this;
            };
        } else { /* Now if this is the last iteration */
            var str2 = key[i];
            image.onload = function() {
                img[str2] = this; /* Add the image as a property to img */
                createWorld(grid.width, grid.height, tile.width, tile.height);
            };
        }
        image.src = assets[i];
    }
}

function keyDownHandler(event) { /* Handler for keyup events */
    event.preventDefault();
    if (event.keyCode == 39) {
        cursor.rightPressed = true;
    } else if (event.keyCode == 37) {
        cursor.leftPressed = true;
    }
    if (event.keyCode == 40) {
        cursor.downPressed = true;
    } else if (event.keyCode == 38) {
        cursor.upPressed = true;
    }
}

function keyUpHandler(event) { /* Handler for keydown events */
    event.preventDefault();
    if (event.keyCode == 39) {
        cursor.rightPressed = false;
    } else if (event.keyCode == 37) {
        cursor.leftPressed = false;
    }
    if (event.keyCode == 40) {
        cursor.downPressed = false;
    } else if (event.keyCode == 38) {
        cursor.upPressed = false;
    }
}

function createWorld(_numTileWidth, _numTileHeight, _tWidth, _tHeight) {
    /* Following for loop makes the world canvas */
    for (var i = 0, len = _numTileHeight; i < len; i++) {
        for (var k = 0, len2 = _numTileWidth; k < len2; k++) {
            var x = k * _tWidth,
                y = i * _tHeight,
                image = img['tile']; /*getImg('tile') ==> Don't know why this failed, but in the interest of time */
            ctx_world.drawImage(image, x, y, _tWidth, _tHeight);
        }
    }
    /* Here we add the sprite, 'player' */
    addSprite('player');

    /* The game starts here */
    requestAnimationFrame(loop); /* Start the game after world is drawn */
}

function Sprite(key) {

    /* Position of sprite in world */
    this.pos = {
        'x': can_world.width / 2,
        'y': can_world.height / 2
    };

    this.pos2 = { /* Sprite's position in player canvas */
        'x': can_pCanvas.width / 2,
        'y': can_pCanvas.height / 2
    };

    this.speed = { /* Speed of sprite */
        'x': 5,
        'y': 5
    };

    /* Use a helper function that returns an object with x and y as it's properties for the above */

    /* Image reference for sprite. */
    this.img = img[key]; /* The image for sprite */
    this.width = this.img.width; /* Width of sprite image */
    this.height = this.img.height; /* Height of sprite image */

    this.draw = function() {
        ctx_pCanvas.clearRect(0, 0, can_pCanvas.width, can_pCanvas.height); /* Clear the whole player canvas (a canvas used to draw the character only */
        /* This makes sure that the camera stops when the character is near the edge of the screen */
        if (this.pos.x < 320) {
            this.pos2.x = this.pos.x;
        } else if (this.pos.x > can_world.width - 320) {
            this.pos2.x = 640 - (can_world.width - this.pos.x);
        } else {
            this.pos2.x = can_pCanvas.width / 2;
        }

        if (this.pos.y < 320) {
            this.pos2.y = this.pos.y;
        } else if (this.pos.y > can_world.height - 320) {
            this.pos2.y = 640 - (can_world.height - this.pos.y);
        } else {
            this.pos2.y = can_pCanvas.height / 2;
        }

        ctx_pCanvas.drawImage(this.img, this.pos2.x, this.pos2.y); /* Draw the character using it's secondary position */
        // console.log(this.pos2.x, this.pos2.y)
    };

    this.update = function() {
        /* Here we check to see if any buttons where pressed and if our character is in the world */
        if (cursor.rightPressed && this.pos.x < can_world.width - this.width) {
            this.pos.x += this.speed.x;
        } else if (cursor.leftPressed && this.pos.x >= 0) {
            this.pos.x -= this.speed.x;
        }
        if (cursor.downPressed && this.pos.y < can_world.height - this.height) {
            this.pos.y += this.speed.y;
        } else if (cursor.upPressed && this.pos.y >= 0) {
            this.pos.y -= this.speed.y;
        }
    };
}

function addSprite(key) {
    sprites[key] = new Sprite(key); /* Add the sprite using the key as a reference*/
}

function loop() {
    /* Do game stuff here */

    sprites['player'].update(); /* Update player sprite position */
    sprites['player'].draw(); /* Draw player at new/old position. I didn't optimize */

    ctx_vPort.clearRect(0, 0, can_vPort.width, can_vPort.height); /* Clear viewport canvas */
    ctx_vPort.drawImage(can_world, (sprites.player.pos.x < 320 || sprites.player.pos.x > can_world.width - 320) ? 0 : (sprites['player'].pos.x + (sprites['player'].width / 2) - 320), (sprites.player.pos.y < 320 || sprites.player.pos.y > can_world.height - 320) ? 0 : (sprites['player'].pos.y + (sprites['player'].height / 2) - 320), 640, 640, 0, 0, 640, 640); /* This is the 'viewport' itself btw. Just read it ou loud, helps when you want to understand what's going on */
    requestAnimationFrame(loop); /* Loop!!!! */
}

// document.body.appendChild(can_world); Don't uncomment this. Unless you want to see the whole world as it's rendering

/* The magic begins here */
init(['tile', 'player'], ['tile.png', 'player.png']);