function start ( callback ) {
    var Path = require('fire-path');
    var OS = require('os');
    var Del = require('del');
    var Express = require('express');
    var Jade = require('jade');

    var buildPath = Path.join(OS.tmpdir(),'fireball-game-builds');
    Del.sync( Path.join(buildPath, '**/*'), {force: true});

    var app = Express();

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
        res.render('index', {
            pageTitle: 'Foobar!',
        });
    });

    // serves raw assets
    app.get(/^\/resource\/raw\//, function(req, res) {
        var url = req.url;
        console.log('raw asset request: ' + url);

        url = Path.join(Editor.projectPath, 'assets', url.slice('/resource/raw/'.length));

        console.log('send: ' + url);
        res.sendFile(url);
    });

    // serves imported assets
    app.get(/^\/resource\/import\//, function(req, res) {
        var url = req.url;
        console.log('imported asset request: ' + url);

        url = Path.join(Editor.importPath, url.slice('/resource/import/'.length));

        console.log('send: ' + url);
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
}

module.exports = {
    start: start,
};
