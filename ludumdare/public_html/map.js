/// map functions and 'class'

// singleton map loader
var _mapLoader = undefined;

// module creator for global map loader
var mapLoader = function(){
    if(_mapLoader)
        return _mapLoader;
    
    // current map
    var currmap = undefined;
    
    // create a map object and return it
    function loadMap(nro){
        if(!(nro in _maps))
            throw 'map not found';
        var nmap = new map(_maps[nro]);
        currmap = nmap;
        GAME.updateText('Build: ' + currmap.name);
        return currmap;
    }
    
    // public api
    return _mapLoader = {
        // get current map
        currMap: function(){
            return currmap;
        },
        // get map object
        loadMap: loadMap,
        // return list of map names
        getList: function(){
            var temp = [];
            for(var i=0; i<_maps.length; i++){
                temp.push(_maps[i].name);
            }
            return temp;
        }
    };
};

// utilities module
var mapUtils = (function(){
    
//    // get corresponding default image from tileset
//    function getImg(tilenumber){
//        var corresp = {
//            0: 0,
//            1: 1,
//            2: 2,
//            3: 3
//        }
//        if(corresp[tilenumber])
//            return corresp[tilenumber];
//        
//        throw 'cannot find image for tile ' + tilenumber
//    }
    
//    // return tile default hitdata
//    function getHit(tilenumber){
//        switch(tilenumber){
//            case 1: // wall
//                return true;
//            default:
//                return false;
//        }
//    }
})();

// tile constructor
function tile(x, y, type, hit, data){
    
    this.x      = x || 0;
    this.y      = y || 0;
    this.type   = type || 0;    // bg
    this.hit    = hit || 0;     // no hit by default
    this.data   = data || 0;    // no data
    
    this.w = tile_w;
    this.h = tile_h;
    
    // tile image in tileset
    this.img = type;
    
    // get tile coordinates within tileset
    this.getTilePicPosX = function(){
        return this.img * tile_w;
    }
    
    // get tile X coordinate in map
    this.getTileX = function(){
        return this.x * tile_w;
    };

    // get tile Y coordinate in map
    this.getTileY = function(){
        return this.y * tile_h;
    };
    
    // return absolute position on canvas
    this.getAbsolutePos = function(){
        return {x: this.getTileX(), y: this.getTileY()};
    };
}

// map constructor
// given a map JSON data
function map(obj, name){
    
    // array for tile objects
    var tiles = [];
    if(!obj.tiles)
        throw 'map JSON does not have tile data defined';
    
    this.w = 0;
    this.h = 0;
    
    // convert numbers to objects
    for(var y=0; y<obj.tiles.length; y++){
        for(var x=0; x<obj.tiles[0].length; x++){
            // get tile number from JSON
            var temptile = obj.tiles[y][x];
            // create new tile object
            tiles.push(new tile(x, y, temptile, temptile > 0 ? true : false, 0));
        }
        // update map width
        this.w = Math.max(x, this.w);
    }
    
    // update map height
    this.h = y;
    
    // get the level shape
    this.shape = obj.shape;
    
    // size in pixels
    this.w_pixels = this.w * tile_w;
    this.h_pixels = this.h * tile_h;
    
    this.name = name || obj.name || 'unnamed';
    console.log('map', this.name, 'created');
    console.log('width', this.w, 'height', this.h);
    
    // references to objects
    this.objects = [];
    for(var i=0; i < obj.objects.length; i++){
        this.objects.push(new gameObject(obj.objects[i][0], obj.objects[i][1].x, obj.objects[i][1].y));
    }
    
    // draw each tile
    // sX sY relative start point
    this.drawMap = function(sX, sY, callback){
        tiles.forEach(function(tile){
            var pos = tile.getAbsolutePos();
            callback(sX + pos.x, sY + pos.y, _images.tileset,
                tile.getTilePicPosX(), 0, tile.w, tile.h);
        });
    };
    
    // get a tile object from coordinates
    this.getTile = function(x, y){
        return tiles[y * this.w + x];
    }
    
    // get hit data
    this.getHit = function(x, y){
        return this.getTile(x, y).hit;
    };
    
    // return tile objects for drawing
    this.getTiles = function(){
        return this.tiles;
    };
    
    // returns the object if it's at the given absolute coordinates
    this.pickUpObj = function(x, y){
        for(var i=0; i < this.objects.length; i++){
            if(this.objects[i].isAt(x, y)){
                return this.objects[i];
            }
        }
        return undefined;
    };
    
    // returns the object at given tile
    this.pickUpObjTile = function(x, y){
        var result;
        this.objects.some(function(obj){
            if(obj.x == x && obj.y == y){
                result = obj;
                return true;
            }
            return false;
        });
        if(result)
            return result;
    }
    
    console.log('map', name, 'loaded, shape', this.shape);
}