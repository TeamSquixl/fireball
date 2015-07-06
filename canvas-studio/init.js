var Fs = require('fire-fs');
var Path = require('fire-path');
var Url = require('fire-url');
var Async = require('async');
var Shell = require('shell');

//
Editor.versions['canvas-studio'] = '0.1.0';
Editor.projectPath = '';
Editor.requireLogin = false;

// init
module.exports = function ( options, cb ) {
    Editor.projectPath = options.args[0];
    Editor.runtimePath = '';
    Editor.requireLogin = !Editor.isDev || options.requireLogin;
    Editor.projectInfo = null;

    if ( !Editor.metas ) Editor.metas = {};
    if ( !Editor.inspectors ) Editor.inspectors = {};
    if ( !Editor.properties ) Editor.properties = {};

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
                Editor.runtimePath = Editor.url('app://runtime/runtime-' + info.runtime);

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
            Editor.registerDefaultLayout( Editor.url('app://canvas-studio/static/layout.json') );

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
                'default-asset': Fire.Asset,
            });
            Editor.libraryPath = Editor.assetdb.library;
            Editor.importPath = Editor.assetdb._importPath;

            // register uuid:// protocol
            function _url2path (urlInfo) {
                var root;
                var uuid = urlInfo.hostname;

                if ( urlInfo.query === 'thumbnail' ) {
                    root = Editor.assetdb._thumbnailPath;
                    return Path.join( root, uuid.substring(0,2), uuid + '.png' );
                }

                //
                root = Editor.assetdb._importPath;
                return Path.join( root, uuid.substring(0,2), uuid );
            }

            var Protocol = require('protocol');
            Protocol.registerProtocol('uuid', function(request) {
                var url = decodeURIComponent(request.url);
                var data = Url.parse(url);
                var file = _url2path(data);
                return new Protocol.RequestFileJob(file);
            });
            Editor.registerProtocol('uuid', _url2path );

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
        var child = Spawn(exePath, Editor.appPath, {
            detached: true,
            stdio: 'ignore',
        });
        child.unref();

        Editor.quit();
    },

    run: function () {
        Async.series([
            function ( next ) {
                Editor.assetdb.mount(Path.join(Editor.projectPath, 'assets'),
                                     'assets',
                                     next);
            },

            function ( next ) {
                Editor.assetdb.init( next );
            },

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

                // open dev tools if needed
                if ( Editor.showDevtools ) {
                    win.nativeWin.webContents.once('did-finish-load', function () {
                        win.openDevTools({
                            detach: true
                        });
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
    // @param {object} [query]
    // @param {function} [onLoad]
    spawnWorker: function (scriptUrl, query, onLoad) {
        if (typeof query === "function") {
            onLoad = query;
            query = {};
        }
        query.scriptUrl = scriptUrl;
        var url = Url.format({
            protocol: 'file',
            pathname: Editor.url('app://canvas-studio/static/general-worker.html'),
            slashes: true,
            hash: encodeURIComponent(JSON.stringify(query))
        });
        var BrowserWindow = require('browser-window');
        var workerWindow = new BrowserWindow({
            show: false,
        });
        workerWindow.loadUrl(url);
        if (onLoad) {
            workerWindow.webContents.on('did-finish-load', function () {
                onLoad(workerWindow);
            });
        }
        return workerWindow;
    },

    'app:explore-project': function () {
        Shell.showItemInFolder(Editor.projectPath);
    },
});
