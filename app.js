var Fs = require('fire-fs');
var Path = require('fire-path');

//
global.__app = {
    initCommander: function ( commander ) {
        commander
            .usage('[options] <project-path>')
            .option('--require-login', 'Require login in dev mode.')
            .option('--runtime', 'The runtime name. (Only available when create a project in command mode)')
            .option('--template', 'The template name. (Only available when create a project in command mode)')
            ;
    },

    init: function ( options, cb ) {
        var projectPath;
        if ( options.args.length > 0 ) {
            projectPath = Path.resolve(options.args[0]);
        }

        //
        var subinit;

        if ( Editor.devMode === 'packages' ) {
            subinit = require('./package-studio/init');
        }
        else {
            // if we have project path, go to the studio, otherwise go to the dashboard
            if ( projectPath ) {
                subinit = require('./canvas-studio/init');
            } else {
                subinit = require('./dashboard/init');
            }
        }

        if ( subinit ) {
            subinit( options, cb );
            return;
        }

        //
        if ( cb ) {
            cb ();
        }
    },
};

require('./editor-framework/init');

