var Ipc = require('ipc');

// DISABLE
// // init states
// var _states = {
//     'scene-initializing': false,
//     'scene-playing': false,
//     'scene-paused': false,
// };
// Editor.states = {};
// function _defprop ( name, value ) {
//     Editor.states['_'+name] = value;

//     Object.defineProperty( Editor.states, name, {
//         get: function () { return Editor.states['_'+name]; },
//         set: function ( newValue ) {
//             if ( Editor.states['_'+name] !== newValue ) {
//                 Editor.states['_'+name] = newValue;
//                 Editor.sendToAll( 'editor:state-changed', name, newValue );
//             }
//         },
//     });
// }
// for ( var name in _states ) {
//     _defprop ( name, _states[name] );
// }
// Ipc.on('editor:state-changed', function ( name, value ) {
//     Editor.states['_'+name] = value;
// });

// get ip address
var _ipAddress = '';
var ifaces = require('os').networkInterfaces();
var found = false;
for ( var ifname in ifaces ) {
    if ( ifname === /^tun/ )
        continue;

    var faces = ifaces[ifname];
    for ( var i = 0; i < faces.length; ++i ) {
        var iface = faces[i];
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            continue;
        }

        // this interface has only one ipv4 adress
        _ipAddress = iface.address;
        found = true;
        break;
    }

    if ( found )
        break;
}
Editor.IP = _ipAddress;

// apply default main menu
var MainMenuTmplFn = require('./main-menu');
Editor.registerDefaultMainMenu(MainMenuTmplFn);
Editor.MainMenu.reset();

// init modules
Editor.Compiler = require('./compiler');
Editor.Builder = require('./builder');
Editor.PreviewServer = require('./preview-server');

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

Editor.events.on('quit', function () {
    Editor.PreviewServer.stop();
});
