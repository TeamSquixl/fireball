var Ipc = require('ipc');

// init states
var _states = {
    paused: false,
    playing: false,
};
Editor.states = {};
function _defprop ( name, value ) {
    Editor.states['_'+name] = value;

    Object.defineProperty( Editor.states, name, {
        get: function () { return Editor.states['_'+name]; },
        set: function ( newValue ) {
            Editor.states['_'+name] = newValue;
            Editor.sendToAll( 'editor:state-changed', name, newValue );
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

// init compiler
Editor.Compiler = require('./compiler');

// load scene utils
require('./scene-utils');
