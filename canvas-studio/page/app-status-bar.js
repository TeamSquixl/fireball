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

        compilerState: {
            type: String,
            value: 'idle',
        }
    },

    ready: function () {
        var Remote = require('remote');
        var App = Remote.require('app');

        var appVer = App.getVersion();
        this.version = 'Fireball v' + appVer;
    },

    _dbState: function ( state ) {
        return ({
            idle: 'fa fa-database gray',
            busy: 'fa fa-database orange',
        })[state];
    },

    _dbTitle: function ( state ) {
        return "AssetDB State: " + state;
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

    _dbWatchTitle: function ( state ) {
        return "AssetDB Watch State: " + state;
    },

    _compilerState: function ( state ) {
        return ({
            idle: 'fa fa-retweet gray',
            compiling: 'fa fa-retweet orange',
            failed: 'fa fa-retweet red',
        })[state];
    },

    _compilerTitle: function ( state ) {
        return "Compiler State: " + state;
    },
});
