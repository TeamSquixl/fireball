Polymer({
    is: 'app-play-buttons',

    ready: function () {
        var Ipc = require('ipc');

        Ipc.on('editor:state-changed', function ( name, value ) {
            switch ( name ) {
            case 'scene-playing':
                if ( value ) {
                    this.setAttribute('playing','');
                } else {
                    this.removeAttribute('playing');
                    this.$.play.removeAttribute( 'selected' );
                    this.$.pause.removeAttribute( 'selected' );
                }
                break;
            }
        }.bind(this));
    },

    _onPlayClick: function ( event ) {
        if ( Editor.states['scene-initializing'] )
            return;

        if ( !this.$.play.hasAttribute('selected') ) {
            this.$.play.setAttribute( 'selected', '' );

            Editor.states['scene-initializing'] = true;
            Editor.sendToAll('scene:play');
        } else {
            this.$.play.removeAttribute( 'selected' );

            Editor.states['scene-initializing'] = true;
            Editor.sendToAll('scene:stop');
        }

    },

    _onPauseClick: function ( event ) {
        if ( !this.$.pause.hasAttribute('selected') ) {
            this.$.pause.setAttribute( 'selected', '' );

            // TODO:
        } else {
            this.$.pause.removeAttribute( 'selected' );

            // TODO:
        }
    },

    _onStepClick: function ( event ) {
        Editor.log('Step');
    },
});
