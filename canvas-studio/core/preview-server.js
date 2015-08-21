var socketIO;
var app;
var server;
var _browserReload = false;


function _initSocket ( server ) {
    var _connects = 0;

    socketIO = require('socket.io')(server);
    socketIO.on('connection', function ( socket ) {
        socket.emit('connected');

        _connects += 1;
        Editor.sendToMainWindow('preview-server:connects-changed', _connects);

        socket.on('disconnect', function () {
            _connects -= 1;
            Editor.sendToMainWindow('preview-server:connects-changed', _connects);
        });
    });
}

module.exports = {
    /**
     * start
     */
    start: function ( callback ) {
        var Path = require('fire-path');
        var OS = require('os');
        var Del = require('del');
        var Express = require('express');

        var buildPath = Path.join(OS.tmpdir(),'fireball-game-builds');
        Del.sync( Path.join(buildPath, '**/*'), {force: true});

        app = Express();

        app.set('views', Editor.url('app://canvas-studio/static/preview-templates') );
        app.set('view engine', 'jade' );

        // ============================
        // Build
        // ============================

        app.use('/build', Express.static(buildPath));

        app.get('/build', function (req, res) {
            res.send('Please build your game project first!');
        });

        // ============================
        // Preview
        // ============================

        app.get('/', function (req, res) {
            var runtimePkg = require(Path.join(Editor.runtimePath, 'package.json'));
            res.render('index', {
                title: 'Fireball | ' + Editor.projectInfo.name,
                runtimeScripts: runtimePkg.build.scriptsDev,
            });
        });

        app.get('/app/*', function (req, res) {
            var path = Editor.url( 'app://' + req.params[0] );
            res.sendFile(path);
        });

        app.get('/project/*', function (req, res) {
            var path = Path.join(Editor.projectPath, req.params[0]);
            res.sendFile(path);
        });

        app.get('/runtime/*', function (req, res) {
            var path = Path.join(Editor.runtimePath, req.params[0]);
            res.sendFile(path);
        });

        // serves raw assets
        app.get('/resource/raw/*', function(req, res) {
            var url = req.url;
            url = Path.join(Editor.projectPath, 'assets', req.params[0]);

            res.sendFile(url);
        });

        // serves imported assets
        app.get('/resource/import/*', function(req, res) {
            var url = req.url;
            url = Path.join(Editor.importPath, req.params[0]);

            res.sendFile(url);
        });

        app.get('/settings.js', function (req, res) {
            // TODO: dirty check, only rebuild if dirty

            var settings = {
                scenes: Editor.sceneList,
                rawAssets: {},
                designWidth: Editor.stashedScene.designWidth,
                designHeight: Editor.stashedScene.designHeight,
            };

            Editor.assetdb.queryMetas('assets://**/*', '', function (err, results) {
                if (err) {
                    return callback(err);
                }
                var Asset = Fire.Asset;
                var assets = {};

                results.forEach( function ( meta ) {
                    if (meta && meta.useRawfile()) {
                        var type = meta['asset-type'];
                        if (type === 'folder') {
                            return;
                        }

                        var ctor = Editor.assets[type];
                        var isRaw = ctor && !Fire.isChildClassOf(ctor, Asset);
                        var url = Editor.assetdb.uuidToUrl(meta.uuid);
                        var idx = url.indexOf('://');
                        if ( idx !== -1 ) {
                            url = url.slice(idx+3);
                        }

                        assets[meta.uuid] = {
                            url: url,
                            raw: isRaw,
                        };
                    }
                });

                settings.rawAssets = assets;
                var script = '_FireSettings = ' + JSON.stringify(settings, null, 4) + ';\n';
                res.send(script);
            });
        });

        app.get('/stashed-scene.json', function (req, res) {
            if ( Editor.stashedScene ) {
                res.send(Editor.stashedScene.sceneJson);
                return;
            }

            res.sendStatus(404);
        });

        // ============================
        // error handling
        // ============================

        app.use(function (err, req, res, next) {
            console.error(err.stack);
            next(err);
        });

        app.use(function (err, req, res, next) {
            if (req.xhr) {
                res.status(err.status || 500).send({error: err.message});
            }
            else {
                next(err);
            }
        });

        app.use(function (req, res) {
            res.status(404).send({error: '404 Error.'});
        });

        server = app.listen(7456, function () {
            Editor.success('preview server running at http://localhost:7456');

            if ( callback ) callback();
        });

        //
        _initSocket(server);
    },

    /**
     * stop
     */
    stop: function () {
        if ( server ) {
            server.close( function () {
                Editor.info('shutdown preview server');
                server = null;
            });
        }
    },

    /**
     * browserReload
     */
    browserReload: function () {
        if (_browserReload) {
            return;
        }
        _browserReload = setTimeout(function () {
            socketIO.emit('browser:reload');
            clearTimeout(_browserReload);
            _browserReload = false;
        }, 50);
    },
};
