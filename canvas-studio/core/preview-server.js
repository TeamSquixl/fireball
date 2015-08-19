var sockets;

function start ( callback ) {
    var Path = require('fire-path');
    var OS = require('os');
    var Del = require('del');
    var Express = require('express');
    var Jade = require('jade');
    var Uuid = require('node-uuid');

    var buildPath = Path.join(OS.tmpdir(),'fireball-game-builds');
    Del.sync( Path.join(buildPath, '**/*'), {force: true});

    var app = Express();
    var stashedUuid = Uuid.v4();

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

    app.get('/settings.json', function (req, res) {
        // TODO: dirty check, only rebuild if dirty

        var settings = {
            scenes: Editor.sceneList,
            rawAssets: {},
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
            res.json(settings);
        });
    });

    app.get('/stashed-scene.json', function (req, res) {
        if ( Editor.stashedScene ) {
            res.send(Editor.stashedScene.sceneJson);
            return;
        }

        res.sendStatus(404);
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
        res.status(404).send({error: "404 Error."});
    });

    var server = app.listen(7456, function () {
        Editor.success('preview server running at http://localhost:7456');

        if ( callback ) callback();
    });

    //
    sockets = require('socket.io')(server);
    sockets.on('connection', function ( socket ) {
        socket.emit('connected');
    });
}

var _browserReload = false;
function browserReload ( callback ) {
    if (_browserReload) {
        return;
    }
    _browserReload = setTimeout(function () {
        sockets.emit('browser:reload');
        clearTimeout(_browserReload);
        _browserReload = false;
    }, 50);
}

module.exports = {
    start: start,
    browserReload: browserReload,
};
