// objects

// get global map loader
var mapLoad = mapLoader();

// only one object moving at once! this is the guard flag
var _objmoving = false;

// turn direction string to numbers
function getDirection(str){
    var x = 0, y = 0;
    switch (str) {
        case 'up':
            y = -1;
            break;
        case 'down':
            y = 1;
            break;
        case 'left':
            x = -1;
            break;
        case 'right':
            x = 1;
            break;
    }
    return {x: x, y: y};
}

// object images in tileset
var _objImages = {
    'stick' : 2,
    'flint' : 3,
    'rock'  : 4
}

// base object
var gameObject = function(type, x, y){
    this.x = x || 0;
    this.y = y || 0;
    var offsetX = 0;
    var offsetY = 0;
    var dir = 'right';
    this.type = type || 'none'; // type of the object! important
    var moving = false;
    
    // set image from tileset
    var img = _objImages[this.type];
    if(!img){
        console.error('invalid object image, defaulting');
        img = 2;
    }
    
    // checks if a move is valid
    function canMoveTo(x, y){
        var cmap = mapLoad.currMap();
        // stop at borders
        if(x < 0 || x > cmap.w || y < 0 || y > cmap.h)
            return false;
        // stop at wall
        if(cmap.getHit(x, y))
            return false;
        // stop at another object
        var objhit = mapLoad.currMap().objects.some(function(obj){
            if(obj !== this){
                if(x == obj.x && y == obj.y)
                    return true;
                return false;
            }
        });
        if(objhit)
            return false;
        
        // valid move otherwise
        return true;
    };
    
    // send the object moving
    this.sendMoving = function(dir){
        if(!_objmoving && !moving){
            _objmoving = true;
            this.dir = dir;
            moving = true;
        } else{
            console.log('cannot move this object');
        }
    };
    
    // move the object
    this.move = function(){
        if(!moving)
            return false;
        var newp = getDirection(this.dir);
        if(canMoveTo(this.x + newp.x, this.y + newp.y)){
            this.x += newp.x;
            this.y += newp.y;
        } else {
            // stop object and allow new move
            moving = false;
            _objmoving = false;
        }
    }
    
    // draw the object
    this.draw = function(sX, sY, callb){
        callb(sX + this.x * tile_w, sY + this.y * tile_h, _images.tileset, img * tile_w, 0, tile_w, tile_h);
    }
    
    // returns true if the object is at given absolute coordinates
    this.isAt = function(x, y){
        // check if click happened inside object perimeter
        if( this.x       * tile_w < x         &&
            (this.x + 1) * tile_w > x   &&
            this.y       * tile_h < y         &&
            (this.y +1 ) * tile_h > y)
                return true;
        return false;
    }
    
    console.log('object of type ', this.type, 'created at', this.x, this.y);
}