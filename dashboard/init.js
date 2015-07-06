var Path = require('fire-path');
var Fs = require('fire-fs');
var Globby = require('globby');
var Async = require('async');
var _ = require('lodash');

var Project = require('../share/project');

//
Editor.versions.dashboard = '0.1.0';
var requireLogin = false;

// init
module.exports = function ( options, cb ) {
    requireLogin = !Editor.isDev || options.requireLogin;

    Editor.log( 'Initializing Fireball Dashboard' );

    // register global profile path =  ~/.fireball/dashboard/
    var settingsPath = Path.join(Editor.appHome, 'dashboard');
    Fs.ensureDirSync(settingsPath);
    Editor.registerProfilePath( 'global', settingsPath );

    //
    Editor.unregisterPackagePath( Path.join( Editor.appPath, 'builtin' ) );

    if ( cb ) cb ();
};

// mixin app
Editor.JS.mixin(Editor.App, {
    _profile: {},
    _runtimeInfos: {},
    _templateInfos: {},

    loadRuntimeInfos: function ( runtimePath, cb ) {
        var paths = Globby.sync( Path.join(runtimePath,'*/package.json') );
        Async.eachSeries( paths, function ( path, done ) {
            Editor.log('Load runtime info: %s', path);
            try {
                var pkgJsonObj = JSON.parse(Fs.readFileSync(path));
                Editor.App._runtimeInfos[pkgJsonObj.name] = {
                    path: Path.resolve(Path.dirname(path)),
                    name: pkgJsonObj.name,
                    version: pkgJsonObj.version,
                    description: pkgJsonObj.description,
                    link: pkgJsonObj.link
                };
            }
            catch ( err ) {
                Editor.error('Failed to load runtime info at %s, %s', path, err.message);
            }

            done();
        }, cb);
    },

    loadTemplate: function ( templatePath, cb ) {
        var paths = Globby.sync( Path.join(templatePath,'*/package.json') );
        Async.eachSeries( paths, function ( path, done ) {
            Editor.log('Load template: %s', path);
            try {
                var pkgJsonObj = JSON.parse(Fs.readFileSync(path));
                Editor.App._templateInfos[pkgJsonObj.name] = {
                    path: Path.resolve(Path.dirname(path)),
                    name: pkgJsonObj.name,
                    version: pkgJsonObj.version,
                    description: pkgJsonObj.description,
                };
            }
            catch ( err ) {
                Editor.error('Failed to load template at %s, %s', path, err.message);
            }

            done();
        }, cb);
    },

    createProject: function ( opts, cb ) {
        opts = opts || {};
        var runtime, template;

        try {
            if ( typeof opts.path !== 'string' ) {
                throw new Error('opts.path must be string');
            }

            if ( typeof opts.runtime !== 'string' ) {
                throw new Error('opts.runtime must be string');
            }

            runtime = Editor.App._runtimeInfos[opts.runtime];
            if ( !runtime ) {
                throw new Error('Can not find runtime: ' + opts.runtime);
            }

            if ( opts.template ) {
                template = Editor.App._templateInfos[opts.template];
                if ( !template ) {
                    throw  new Error('Can not find template: ' + opts.template);
                }
            }
        }
        catch ( err ) {
            if ( cb ) cb (err);
            return;
        }

        Project.create(opts.path, runtime, template, cb);
    },

    addProject: function ( path ) {
        Project.add( Editor.App._profile, path );
    },

    removeProject: function ( path ) {
        Project.remove( Editor.App._profile, path );
    },

    getProjectInfo: function ( path, cb ) {
        Project.getInfo( path, cb );
    },

    checkProject: function ( path, cb ) {
        Project.check( path, cb );
    },

    runCanvasStudio: function ( projectPath, cb ) {
        var Spawn = require('child_process').spawn;
        var App = require('app');
        var exePath = App.getPath('exe');
        var child = Spawn(exePath, [Editor.appPath, projectPath], {
            detached: true,
            stdio: 'ignore',
        });
        child.unref();

        if ( cb ) cb ();
    },

    run: function () {
        Async.series([
            // load ~/.fireball/fireball.json
            function ( next ) {
                Editor.log('Load ~/.fireball/fireball.json');
                Editor.App._profile = Editor.loadProfile( 'fireball', 'app', {
                    'recently-opened': [],
                    'last-login': '',
                    'remember-passwd': true,
                    'login-type': 'account',
                });

                // filter out same path
                Editor.App._profile['recently-opened'] = _.uniq(Editor.App._profile['recently-opened']);
                Editor.App._profile.save();

                //
                next();
            },

            // load runtime infos
            function ( next ) {
                Editor.App.loadRuntimeInfos( Editor.url('app://runtime/'), next );
            },

            // load template
            // TODO: we still not have template for loading
            // function ( next ) {
            //     Editor.App.loadTemplate( Editor.url('app://template/'), next );
            // },

            // open window
            function ( next ) {
                // create main window
                var win = new Editor.Window('main', {
                    'title': 'Fireball Dashboard',
                    'width': 800,
                    'height': 700,
                    'min-width': 800,
                    'min-height': 600,
                    'show': false,
                    'resizable': true,
                    'frame': false
                });
                Editor.mainWindow = win;

                // restore window size and position
                win.restorePositionAndSize();

                // load and show main window
                win.show();

                // page-level test case
                win.load( 'app://dashboard/index.html' );

                // open dev tools if needed
                if ( Editor.showDevtools ) {
                    win.nativeWin.webContents.once('did-finish-load', function () {
                        win.openDevTools({
                            detach: true
                        });
                    });
                }
                win.focus();

                next();
            },
        ]);
    },

    load: function () {
        // TODO
        // console.log('app load');
    },

    unload: function () {
        // TODO
        // console.log('app unload');
    },

    'app:query-recent': function ( reply ) {
        var pathList = Editor.App._profile['recently-opened'];
        var infos = [];
        Async.each( pathList, function ( path, done ) {
            Editor.App.getProjectInfo ( path, function ( info ) {
                if ( info ) {
                    infos.push(info);
                }
                done ();
            });
        }, function ( err ) {
            if ( err ) {
                Editor.error( err.message );
                reply([]);
                return;
            }

            // save profile to remove not exists projects
            Editor.App._profile['recently-opened'] = infos.map( function ( item ) {
                return item.path;
            });
            Editor.App._profile.save();

            reply( infos );
        });
    },

    'app:create-project': function ( reply, opts ) {
        Async.series([
            function ( next ) {
                Editor.App.createProject ( opts, next );
            },

            function ( next ) {
                Editor.App.runCanvasStudio(opts.path, next );
            },
        ], function ( err ) {
            if ( err ) {
                reply ( Editor.Utils.wrapError(err) );
                return;
            }

            //
            Editor.App.addProject(opts.path);
            Editor.quit();
        });
    },

    'app:open-project': function ( reply, path ) {
        Editor.App.checkProject ( path , function ( err ) {
            if ( err ) {
                reply ( Editor.Utils.wrapError(err) );
                return;
            }

            Editor.App.runCanvasStudio(path, function () {
                Editor.App.addProject(path);
                Editor.quit();
            });
        });
    },

    'app:close-project': function ( path ) {
        Editor.App.removeProject(path);
    },

    'app:get-runtime-infos': function ( event ) {
        event.returnValue = Editor.App._runtimeInfos;
    },

    'app:get-template-infos': function ( event ) {
        event.returnValue = Editor.App._templateInfos;
    },

    'app:window-minimize': function ( event ) {
        Editor.mainWindow.minimize();
    },

    'app:window-close': function ( event ) {
        Editor.mainWindow.close();
    }

});
