/// logging utility
/// essentially a wrapper around console.log but can be modified with ease

// logger singleton
var _logger = undefined;

// module
var LOGGER = function(){
    
    // return singleton if exists
    if(_logger)
        return _logger;
    
    // logging levels
    var levels = [1, 2, 3];
    var levelDef = ['message', 'warning', 'error'];
    
    var fullStack = [];
    var msgStack = [];
    var errStack = [];
    
    // if true then output when encountered
    var output = true;
    
    // if true then output level
    var lvlOutput = true;
    
    // log a message
    function log(msg, lvl){
        lvl = lvl || 0; // default lvl 0
        // push message to output and correct stack
        switch (lvl){
            case 1:
            case 2:
                output && console.log(msg);
                msgstack.push()
                break;
            case 3:
                output && console.error(msg);
                break;
        }
        fullStack.push(msg);
    }
    
    // return message stack
    function getMessages(){
        return msgStack;
    }
    
    // get errors
    function getErrors(){
        return errStack;
    }
    
    // output everything
    function outputLog(){
        fullStack.forEach(function(msg){
            console.log(msg);
        });
    }
    
    // return API
    return _logger = {
        log: log,
        outputLog: outputLog,
        getMessages: getMessages,
        getErrors: getErrors
    };
};