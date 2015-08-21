Polymer({
    is: 'app-play-buttons',

    _onPlayClick: function ( event ) {
        event.stopPropagation();
        Editor.sendToAll('scene:play-on-device');
    },

    _onReloadClick: function ( event ) {
        event.stopPropagation();
        Editor.sendToAll('scene:reload-on-device');
    },
});
