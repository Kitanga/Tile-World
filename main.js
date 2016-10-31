var can_vPort = document.getElementById('viewport'),
    grid = { 'width': 60, 'height': 60 },
    /* This is in tiles not in pixels */
    tile = { 'width': 64, 'height': 64 },

    viewPort = { 'width': 640, 'height': 640 },

    can_world = createElement('canvas', {
        'width': '3840px',
        'height': '3840px'
    }),
    img = [],
    /* This is where all images are saved */
    sprites = {}; /* This is where all sprites are placed */

var ctx_vPort = can_vPort.getContext('2d'),
    ctx_world = can_world.getContext('2d');

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

function init(assets) {
    /* Load assets. This is very simple, to save time. */
    for (var i = 0, len = assets.length; i < len; i++) {
        var image = new Image();
        if (!(i === len - 1)) { /* If this isn't the last iteration */
            image.onload = function() {
                img.push(this);
            };
        } else { /* Now if this is the last iteration */
            image.onload = function() {
                img.push(this);
                createWorld(grid.width, grid.height, tile.width, tile.height);
            };
        }
        image.src = assets[i];
    }
}

function createWorld(_numTileWidth, _numTileHeight, _tWidth, _tHeight) {
    for (var i = 0, len = _numTileHeight; i < len; i++) {
        for (var k = 0, len2 = _numTileWidth; k < len2; k++) {
            var x = k * _tWidth,
                y = i * _tHeight,
                image = img[0] /*getImg('tile') ==> Don't know why this failed, but in the interest of time */ ;
            ctx_world.drawImage(image, x, y, _tWidth, _tHeight);
        }
    }
    requestAnimationFrame(loop); /* Start the game after world is drawn */
}

function addSprite(key) {
    sprites[key] = new Sprite();
}

function loop() {
    /* Do game stuff here */


    requestAnimationFrame(loop);
}

// document.body.appendChild(can_world);
addSprite('player');
init(['tile.png', 'player.png']);