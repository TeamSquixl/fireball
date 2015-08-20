var Fs = require('fire-fs');
var Path = require('fire-path');
var Url = require('fire-url');
var Async = require('async');
var Shell = require('shell');
var DevTools = require('./core/dev-tools');

//
Editor.versions['canvas-studio'] = '0.2.0';
Editor.projectPath = '';
Editor.requireLogin = false;

// init
module.exports = function ( options, cb ) {
    Editor.projectPath = Path.resolve(options.args[0]);
    Editor.runtimePath = '';
    Editor.runtimeUrl = '';
    Editor.requireLogin = !Editor.isDev || options.requireLogin;
    Editor.projectInfo = null;

    if ( !Editor.assets ) Editor.assets = {};
    if ( !Editor.metas ) Editor.metas = {};
    if ( !Editor.inspectors ) Editor.inspectors = {};
    if ( !Editor.properties ) Editor.properties = {};
    if ( !Editor.menus ) Editor.menus = {};

    var Project = require('../share/project');

    Async.series([
        // create project if path not exists (happy, a clean directory for us!)
        function ( next ) {
            if ( Fs.existsSync(Editor.projectPath) ) {
                next ();
                return;
            }

            var runtime, template;

            if ( options.runtime ) {
                var runtimePath = Editor.url('app://runtime/runtime-' + options.runtime);
                var pkgJsonObj = JSON.parse(Fs.readFileSync( Path.join(runtimePath, 'package.json') ));
                runtime = {
                    path: runtimePath,
                    name: pkgJsonObj.name,
                    version: pkgJsonObj.version,
                    description: pkgJsonObj.description,
                };
            }

            if ( options.template ) {
                // TODO
            }

            //
            Editor.log( 'Create project %s', Editor.projectPath );
            Project.create(Editor.projectPath, runtime, template, next);
        },

        // check if project valid
        function ( next ) {
            Editor.log( 'Check project %s', Editor.projectPath );
            Project.check( Editor.projectPath, function ( err, info ) {
                if ( err ) {
                    next (err);
                    return;
                }

                Editor.projectInfo = info;
                Editor.runtimeUrl = 'app://runtime/runtime-' + info.runtime;
                Editor.runtimePath = Editor.url(Editor.runtimeUrl);

                next();
            } );
        },

        // initialize canvas studio
        function ( next ) {
            Editor.log( 'Initializing Fireball Canvas Studio' );

            // register panel window
            Editor.Panel.templateUrl = 'app://canvas-studio/static/window.html';

            // register selections
            Editor.Selection.register('asset');
            Editor.Selection.register('node');

            // register global profile path =  ~/.fireball/canvas-studio/
            var globalProfilePath = Path.join(Editor.appHome, 'canvas-studio');
            Fs.ensureDirSync(globalProfilePath);
            Editor.registerProfilePath( 'global', globalProfilePath );

            // register default layout
            Editor.registerDefaultLayout( Editor.url('app://canvas-studio/static/layout/default.json') );

            // init core modules
            require('./core/init');

            next ();
        },

        // initialize engine-framework
        function ( next ) {
            Editor.log( 'Initializing Engine Framework (Fire)' );
            require('../engine-framework');

            next ();
        },

        // initialize asset-database
        function ( next ) {
            Editor.log( 'Initializing Asset Database' );
            var AssetDB = require('../asset-db');
            Editor.assetdb = new AssetDB({
                'cwd': Path.join( Editor.projectPath ),
                'library': 'library',
            });
            Editor.libraryPath = Editor.assetdb.library;
            Editor.importPath = Editor.assetdb._importPath;

            next ();
        },

        // load builtin packages
        function ( next ) {
            Editor.log( 'Loading builtin packages' );
            Editor.loadPackagesAt( Path.join( Editor.appPath, 'builtin' ), next );
        },

        // initialize runtime
        function ( next ) {
            Editor.log( 'Initializing Runtime %s', Editor.projectInfo.runtime );
            require( Editor.runtimePath );
            Runtime.init(Editor.assetdb);

            next ();
        },

        // load runtime packages
        function ( next ) {
            Editor.log( 'Loading runtime packages' );

            // register {runtime-path}/packages
            Editor.registerPackagePath( Path.join(Editor.runtimePath, 'packages') );
            Editor.loadPackagesAt( Path.join(Editor.runtimePath, 'packages'), next );
        },

        // initialize project
        function ( next ) {
            Editor.log( 'Initializing project %s', Editor.projectPath );

            // register profile 'project' = {project}/settings/
            Editor.registerProfilePath( 'project', Path.join(Editor.projectPath, 'settings') );

            // register profile 'local' = {project}/local/
            Editor.registerProfilePath( 'local', Path.join(Editor.projectPath, 'local') );

            // register packages = ~/.fireball/packages/
            // register packages = {project}/packages/
            Editor.registerPackagePath( Path.join(Editor.appHome, 'packages') );
            Editor.registerPackagePath( Path.join(Editor.projectPath, 'packages') );

            next ();
        },

    ], function ( err ) {
        if ( cb ) cb ( err );
    });
};

// mixin app
Editor.JS.mixin(Editor.App, {
    runDashboard: function () {
        var Spawn = require('child_process').spawn;
        var App = require('app');
        var exePath = App.getPath('exe');
        var child = Spawn(exePath, [Editor.appPath], {
            detached: true,
            stdio: 'ignore',
        });
        child.unref();

        Editor.quit();
    },

    run: function () {
        var recompile = false;
        var AssetDB = require('../asset-db');

        Async.series([
            // mount assets://
            function ( next ) {
                Editor.assetdb.mount(Path.join(Editor.projectPath, 'assets'),
                                     'assets',
                                     AssetDB.MountType.asset,
                                     next);
            },

            // // mount raw://
            // function ( next ) {
            //     Editor.assetdb.mount(Path.join(Editor.projectPath, 'raw'),
            //                          'raw',
            //                          'raw',
            //                          next);
            // },

            // start assetdb
            function ( next ) {
                Editor.assetdb.init( function ( err, imports ) {
                    imports.forEach( function ( info ) {
                        if ( !recompile ) {
                            recompile = Editor.Compiler.needCompile(info.type);
                        }
                    });

                    next ();
                } );
            },

            // query the scene list from asset-db
            function ( next ) {
                Editor.sceneList = [];
                Editor.assetdb.queryAssets('assets://**/*', 'scene', function ( err, results ) {
                    Editor.sceneList = results.map( function ( result ) {
                        return { url: result.url, uuid: result.uuid };
                    });
                });

                next();
            },

            // start preview server
            function ( next ) {
                Editor.PreviewServer.start( next );
            },

            // open canvas-studio main window
            function ( next ) {
                // create main window
                var win = new Editor.Window('main', {
                    'title': 'Fireball - Canvas Studio',
                    'width': 1280,
                    'height': 720,
                    'min-width': 100,
                    'min-height': 100,
                    'show': false,
                    'resizable': true,
                });
                Editor.mainWindow = win;

                // restore window size and position
                win.restorePositionAndSize();

                // load and show main window
                win.show();

                // page-level test case
                win.load( 'app://canvas-studio/index.html' );

                // FIXME: should we make sure load scene after compile finished???
                win.nativeWin.webContents.once('did-finish-load', function () {
                    if ( recompile ) {
                        Editor.log( 'Compiling scripts...' );
                        Editor.Compiler.compileScripts();
                    }
                });

                // open dev tools if needed
                if ( Editor.showDevtools ) {
                    win.nativeWin.webContents.once('did-finish-load', function () {
                        win.openDevTools({
                            detach: true
                        });
                        DevTools.highlightHeaderLater(win.nativeWin);
                    });
                }
                win.focus();

                next ();
            },
        ], function ( err ) {
            if ( err ) {
                Editor.error( 'Failed to run canvas-studio, message: %s', err.stack );
            }
        });
    },

    load: function () {
        // TODO
        // console.log('app load');
    },

    unload: function () {
        // TODO
        // console.log('app unload');
    },

    // @param {string} scriptUrl
    // @param {object} [argv]
    // @param {function} [onLoad]
    spawnWorker: function (scriptUrl, argv, onLoad, debug) {
        if (typeof argv === 'function') {
            debug = onLoad;
            onLoad = argv;
            argv = {};
        }
        argv.scriptUrl = scriptUrl;

        var workerWindow = new Editor.Window('worker', {
            show: !!debug,
        });
        if (debug) {
            workerWindow.openDevTools();
        }
        workerWindow.load('app://canvas-studio/static/general-worker.html', argv);
        if (onLoad) {
            workerWindow.nativeWin.webContents.on('did-finish-load', function () {
                onLoad(workerWindow.nativeWin);
            });
        }
        return workerWindow;
    },

    'app:explore-project': function () {
        Shell.showItemInFolder(Editor.projectPath);
    },

    'app:register-menu': function (type, menu) {
        Editor.menus[type] = menu;
    },

    'app:compile-worker-error': function (error) {
        Editor.Compiler._onWorkerError(error);
    },

    'app:compile-worker-end': function () {
        Editor.Compiler._onWorkerEnd();
    },

    'app:build-project': function (options) {
        Editor.Builder.build(options);
    },

    'app:build-project-abort': function (error) {
        // forward ipc
        Editor.Builder.emit('app:build-project-abort', error);
    },

    'app:play-on-device': function () {
        Editor.PreviewServer.browserReload();
        Editor.log('Browse Reloaded');
    },
});
