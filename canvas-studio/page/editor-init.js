var Ipc = require('ipc');

Editor.projectInfo = Editor.remote.projectInfo;
Editor.libraryPath = Editor.remote.libraryPath;
Editor.importPath = Editor.remote.importPath;

if ( !Editor.metas ) Editor.metas = {};
if ( !Editor.inspectors ) Editor.inspectors = {};
if ( !Editor.properties ) Editor.properties = {};
if ( !Editor.gizmos ) Editor.gizmos = {};

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
for ( var name in Editor.remote.states ) {
    var realName = name.substring(1);
    _defprop ( realName, Editor.remote.states[name] );
}
Ipc.on('editor:state-changed', function ( name, value ) {
    Editor.states['_'+name] = value;
});

window.addEventListener('beforeunload', function ( event ) {
    Editor.Selection.clear('node');
    // TODO: event.returnValue =
});
