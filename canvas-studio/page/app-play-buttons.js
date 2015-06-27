Polymer({
    is: 'app-play-buttons',

    _onPlay: function ( event ) {
        event.preventDefault();
        event.stopPropagation();

        Editor.sendToAll('scene:play');
    },

    _onStop: function ( event ) {
        event.preventDefault();
        event.stopPropagation();

        Editor.sendToAll('scene:stop');
    },
});
