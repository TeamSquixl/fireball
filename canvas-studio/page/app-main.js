Polymer({
    is: 'app-main',

    properties: {
        dbState: {
            type: String,
            value: 'idle',
        },

        dbWatchState: {
            type: String,
            value: 'watch-off',
        },
    },

    ready: function () {
        var Ipc = require('ipc');

        Ipc.on( 'asset-db:state-changed', function ( state ) {
            this.set( 'dbState', state );
        }.bind(this) );

        Ipc.on( 'asset-db:watch-state-changed', function ( state ) {
            this.set( 'dbWatchState', state );
        }.bind(this) );
    },
});
