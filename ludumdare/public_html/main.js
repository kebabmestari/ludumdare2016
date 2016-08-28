/// main file

// ludum dare project
// by Samuel Lindqvist

// global object which holds DOM images
var _images = {};

// main module
var GAME = (function(global){

    // canvas and its context
    var can = document.getElementById('game'),
        ctx = can.getContext('2d');
    
    // main controller
    var controller;
    var mapLoad;
    
    // excess space to center map
    var ylijaaX = 0, ylijaaY = 0;
    
    // array for game objects
    var gameObjects = [];
    
    // current map
    var map = undefined;
    
    // game state
    // 0 loading
    // 1 menu
    // 2 ingame
    var state = 0;
    
    // gameview max size
    var CANVAS_MAX_SIZE = {
        w: 640,
        h: 480
    };

    // initialize everything
    function init(){
        
        ctx.strokeText('initializing...', 10, 10);
        
        // width height ratio so different size wont look wonky
        var wh_ratio = CANVAS_MAX_SIZE.h / CANVAS_MAX_SIZE.w;
        // get the size to use for canvas
        var can_real_size = Math.min(CANVAS_MAX_SIZE.w, document.body.clientWidth);
        // set canvas size
        can.width = can_real_size;
        can.height = can_real_size * wh_ratio;
        console.log('canvas set to size', can.width, can.height);
        
        // load images from the page to JS
        loadImages();
        
        // map loading module
        mapLoad = mapLoader();
        map = mapLoad.loadMap(0);
        
        // disable drag for IE
        document.onselectstart = function() {
            return false;
        };
        
        // create new controller to listen to clicks and taps
        controller = control();
        
        console.log('controller created and listening');
        
        // update on each frame
        window.requestAnimationFrame(GAME.update);
        
        // update state to launch menu
        state = 2;
        
        console.log('game initialized');
    }
    
    // recalculate excess space and center map after loading new
    function reCalculateExcess(){
        if(can.width > map.w_pixels){
            ylijaaX = ((can.width - map.w_pixels) / 2) | 0;
            ylijaaY = ((can.height - map.h_pixels) / 2) | 0;
        }
    }
    
    // load image elements from the page into global
    function loadImages(){
        // transforms DOM array into proper JS array
        function toArray(obj) {
          var array = [];
          // iterate backwards ensuring that length is an UInt32
          for (var i = obj.length >>> 0; i--;) { 
            array[i] = obj[i];
          }
          return array;
        }
        var imgs = toArray(document.getElementsByTagName('img'));
        imgs.forEach(function(img){
            _images[img.id] = img;
            console.log(img.id, 'loaded');
        });
        
        console.log('all images loaded');
    }
    
    // draw the game
    function drawGame(){
        
       // draw map
       map.drawMap(ylijaaX, ylijaaY, drawImage);
       
       // draw objects
       var objlist = map.objects;
       for(var i=0; i<objlist.length; i++){
           objlist[i].draw(ylijaaX, ylijaaY, drawImage);
       }
    }
    
    // update game
    function update(){
        
        // clear screen
        ctx.clearRect(0, 0, can.width, can.height);
        
        reCalculateExcess();
        
        // handle logic based on game state
        switch (state){
            case 0:
                break;
            case 1:
                updateMenu();
                break;
            case 2:
                updateGame();
                break;
            default:
                throw 'invalid game state';
        }
        
        // reset controller statuses
        controller.reset();
        
        window.requestAnimationFrame(update)
    }
    
    // handle menu
    function updateMenu(){
        
    }
    
    // update game logic and objects
    function updateGame(){
        
        // get control statuses
        var swipe = controller.getSwipe();
        var tap = controller.getTap();
        
        // check for swipes
        if(swipe.swiped){
            console.log(swipe)
            map.objects.forEach(function(obj){
                if(obj.isAt(swipe.x - ylijaaX, swipe.y - ylijaaY)){
                    console.log('swiped object', obj.name);
                    // move object to direction
                    obj.sendMoving(swipe.dir);
//                    console.log('sending', obj, 'to', swipe.dir)
                }
            });
        }
        
        // move objects
        map.objects.forEach(function(obj){
            obj.move();
        });
        
        // check if the game winning scenario has been met
        checkForWin();
        
        // draw map and objects
        drawGame();
    }
    
    // check for level complete
    function checkForWin(){
        var m = map;
        var shape = _shapes[m.shape];
        if(!shape)
            throw 'invalid shape in map';
        // iterate through objects
        // see if a shape has been met
        var win = m.objects.some(function(){
            var cond = true;
            // iterate through shape and ensure every piece is in correct order
            // otherwise return false
            for(var y=0; y<shape.length; y++){
                for(var x=0; x<shape[0].length; x++){
                    
                }
            }
            return cond;
        });
        if(win)
            alert('yay');
    }
    
    // clear map
    function clear(){
        // clear objects
        gameObjects.length = 0;
    }
    
    // reset lvl
    function reset(){
        
    }
    
    // draws image at absolute coordinates
    function drawImage(x, y, img, s_x, s_y, w, h){
        if(!(x || y || img || s_x || s_y || w || h))
            throw 'All arguments must be given to drawImage';
        ctx.drawImage(img, s_x, s_y, w, h, x, y, w, h);
    }

    // API
    return {
      init: init,
      update: update,
      reset: reset,
      getCanvas: function(){
          return can;
      },
      reCalcExcess: reCalculateExcess
    };
})(window);

// singleton controller
var _control;

// WARNING!! HORRIBLE COPY PASTE CODE FROM PREVIOUS PROJECT AHEAD
// PROCEED WITH CAUTION

// function to return the main controller
// must be called after GAME initialization
var control = function(){
    
    // return singleton
    if(_control)
        return _control;
   
    // swipe state
    var swipe = {
        dir: 'right',
        x: 0,
        y: 0,
        swiped: false
    };
    var tap = {
        tapped: false,
        x: 0,
        y: 0
    };
    
    // listen to tap (mouse)
    window.addEventListener('mousedown', function(e){
        handleTap(e.clientX, e.clientY);
    });
    
    // listen to tap (touch)
    window.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        var x = touchobj.pageX;
        var y = touchobj.pageY;
        handleTap(x, y);
    });
    
    // utility to transform in page coordinates to in game coordinates
    function pageToGame(x, y){
        // get canvas elem
        var rect = GAME.getCanvas().getBoundingClientRect();
        var result = {};
        result.x = x - rect.left;
        result.y = y - rect.top;
        return result;
    }
    
    // handle tap by mouse or touch
    function handleTap(x, y){
        var rect = GAME.getCanvas().getBoundingClientRect();
        tap.x = x - rect.left;
        tap.y = y - rect.top;
        tap.tapped = true;
        console.log('tapped at', tap.x, tap.y);
    }
        
    // attach callback which updates states
    swipeDetect(GAME.getCanvas(), function(dir, x, y){

        // get canvas position
        var rect = GAME.getCanvas().getBoundingClientRect();   
        
        // update position
        swipe.x = x - rect.left;
        swipe.y = y - rect.top;
        
//        console.log('swiped at ', swipe.x, swipe.y)
        
        // update states
        switch (dir){
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                swipe.swiped = true;
                swipe.dir = dir;
                console.log('swiped', swipe.dir);
                break;
            case 'none':
                console.log('no swipe');
                swipe.swiped = false;
                break;
        }
    });
   
    //handle touchscreen swipe
    function swipeDetect(el, callback){
        var touchsurface = el,
             swipedir,
             startX,
             startY,
             distX,
             distY,
             threshold = 50,
             restraint = 100, 
             allowedTime = 300,
             elapsedTime,
             startTime,
        handleswipe = callback || function(swipedir){};
        // handle mouse 'swipe'
        touchsurface.addEventListener('mousedown', function(e){
            // ignore all but left mouse
            if(e.button != 0)
            swipedir = 'none';
            // get click position
            startX = e.clientX;
            startY = e.clientY;
            startTime = new Date().getTime();
            
//            console.log('listening to mouse event at', startX, startY);
            
        }, false);
        
        // end mouse swipe
        touchsurface.addEventListener('mouseup', function(e){
            distX = e.clientX - startX;
            distY = e.clientY - startY;
            // time treshold disabled for mouse swipe
//            elapsedTime = new Date().getTime() - startTime;
//            if (elapsedTime <= allowedTime){
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                    swipedir = (distX < 0)? 'left' : 'right';
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                    swipedir = (distY < 0)? 'up' : 'down';
                }
//            }
            
//            console.log('swiped distance', distX, distY);
            
            // send direction and touch position to callback
            handleswipe(swipedir, startX, startY);
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = 'none';
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
            e.preventDefault();
            
            console.log('listening to touch event at', startX, startY);
        }, false);

        // do nothing while moving like moving page
        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            if (elapsedTime <= allowedTime){
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                    swipedir = (distX < 0)? 'left' : 'right';
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                    swipedir = (distY < 0)? 'up' : 'down';
                }
            }
            
//            console.log('swiped distance', distX, distY);
            
            // send direction and touch position to callback
            handleswipe(swipedir, startX, startY);
            e.preventDefault();
        }, false);
    }
    
    // public API
    return _control = {
        // get swipe data
        getSwipe: function(){
            return swipe;
        },
        getTap: function(){
            return tap;
        },
        // reset statuses
        reset: function(){
            swipe.dir = 'none'; swipe.swiped = false;
            tap.tapped = false;
        },
        pageToGame: pageToGame
    };
};

// wait for page and init game
window.addEventListener('load', GAME.init);