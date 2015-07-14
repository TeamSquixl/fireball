Polymer({
    is: 'app-status-bar',

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
        var Remote = require('remote');
        var App = Remote.require('app');

        var appVer = App.getVersion();
        this.version = 'Fireball v' + appVer;
    },

    _dbState: function ( state ) {
        return 'fa fa-database ' + state;
    },

    _dbWatchState: function ( state ) {
        if ( state === 'watch-starting' )
            return 'fa fa-eye orange';

        if ( state === 'watch-on' )
            return 'fa fa-eye green';

        if ( state === 'watch-stopping' )
            return 'fa fa-eye-slash red';

        if ( state === 'watch-off' )
            return 'fa fa-eye-slash gray';
    },
});
