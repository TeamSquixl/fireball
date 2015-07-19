var Ipc = require('ipc');

// init states
var _states = {
    'scene-initializing': false,
    'scene-playing': false,
    'scene-paused': false,
};
Editor.states = {};
function _defprop ( name, value ) {
    Editor.states['_'+name] = value;

    Object.defineProperty( Editor.states, name, {
        get: function () { return Editor.states['_'+name]; },
        set: function ( newValue ) {
            if ( Editor.states['_'+name] !== newValue ) {
                Editor.states['_'+name] = newValue;
                Editor.sendToAll( 'editor:state-changed', name, newValue );
            }
        },
    });
}
for ( var name in _states ) {
    _defprop ( name, _states[name] );
}
Ipc.on('editor:state-changed', function ( name, value ) {
    Editor.states['_'+name] = value;
});


// apply default main menu
var MainMenuTmplFn = require('./main-menu');
Editor.registerDefaultMainMenu(MainMenuTmplFn);
Editor.MainMenu.reset();

// init modules
Editor.Compiler = require('./compiler');
Editor.Builder = require('./builder');

// load scene utils
require('./scene-utils');

// asset-db ipc
require('./asset-db-ipc');


// ====================
// register events
// ====================

Editor.events.on('focus', function () {
    Editor.assetdb.watchOFF();
});

Editor.events.on('blur', function () {
    Editor.assetdb.watchON();
});
