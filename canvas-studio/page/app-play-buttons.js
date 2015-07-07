Polymer({
    is: 'app-play-buttons',

    ready: function () {
        var Ipc = require('ipc');

        Ipc.on('editor:state-changed', function ( name, value ) {
            switch ( name ) {
            case 'scene-playing':
                if ( value ) {
                    this.setAttribute('playing','');
                    this.$.play.setAttribute( 'selected', '' );
                } else {
                    this.removeAttribute('playing');
                    this.$.play.removeAttribute( 'selected' );
                    this.$.pause.removeAttribute( 'selected' );
                }
                break;
            }
        }.bind(this));

        Ipc.on('editor:toggle-play', function () {
            this.togglePlay();
        }.bind(this));
    },

    togglePlay () {
        if ( Editor.states['scene-initializing'] )
            return;

        if ( !Editor.states['scene-playing'] ) {
            Editor.states['scene-initializing'] = true;
            Editor.sendToAll('scene:play');
        } else {
            Editor.states['scene-initializing'] = true;
            Editor.sendToAll('scene:stop');
        }
    },

    _onPlayClick: function ( event ) {
        event.stopPropagation();
        this.togglePlay();
    },

    _onPauseClick: function ( event ) {
        event.stopPropagation();

        if ( !this.$.pause.hasAttribute('selected') ) {
            this.$.pause.setAttribute( 'selected', '' );

            // TODO:
        } else {
            this.$.pause.removeAttribute( 'selected' );

            // TODO:
        }
    },

    _onStepClick: function ( event ) {
        event.stopPropagation();

        Editor.log('Step');
    },
});
