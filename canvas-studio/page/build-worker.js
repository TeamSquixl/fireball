// page-level worker

var Ipc = require('ipc');
var Path, Gulp, es;

var importPath;

// 必须立刻监听 IPC，否则会漏接收消息
Ipc.on('app:init-build-worker', function (callback) {
    Path = require('path');
    Gulp = require('gulp');
    es = require('event-stream');

    Editor.require('app://engine-framework');
    Editor.require('packages://canvas-assets/asset');

    //var runtimeUrl = 'app://runtime/runtime-' + Editor.remote.projectInfo.runtime + '/index.html';
    //var link = document.createElement('link');
    //link.rel = 'import';
    //link.onload = function (event) {
    //    callback();
    //};
    //link.onerror = callback;
    //link.href = runtimeUrl;
    //document.body.appendChild(link);

    var Async = require('async');
    var runtimePath = Editor.remote.runtimePath;
    importPath = Editor.remote.importPath;

    var runtimePkg = require(Path.join(runtimePath, 'package.json'));
    var runtimeScripts = runtimePkg.build.scriptsDev;

    Async.waterfall([
        // load runtime
        function (next) {
            Async.waterfall(
                runtimeScripts.map(function (script) {
                    return function (next) {
                        var scriptEL = document.createElement('script');
                        scriptEL.onload = function (event) {
                            next();
                        };
                        scriptEL.onerror = function (event) {
                            next(new Error('Failed to load ' + scriptEL.src));
                        };
                        scriptEL.src = Path.resolve(runtimePath, script);;
                        document.head.appendChild(scriptEL);
                    };
                }),
                next
            );
        },
        // init engine
        function (next) {
            Fire.AssetLibrary.init(importPath);
            var canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            Fire.engine.init({
                width: 800,
                height: 600,
                canvas: canvas
            }, next);
        },
        // load compiled script
        function (next) {
            function doLoad (src, cb) {
                var script = document.createElement('script');
                script.onload = function () {
                    cb();
                };
                script.onerror = function () {
                    console.error('Failed to load %s', src);
                    cb(new Error('Failed to load ' + src));
                };
                script.setAttribute('type','text/javascript');
                script.setAttribute('charset', 'utf-8');
                script.setAttribute('src', src);
                document.head.appendChild(script);
            }
            var scriptPath = Path.join(Editor.remote.libraryPath, 'bundle.project.js');
            var Fs = require('fire-fs');
            Fs.exists(scriptPath, function (exists) {
                if (exists) {
                    doLoad(scriptPath, next);
                }
                else {
                    next();
                }
            });
        }],
        callback
    );

});

Ipc.on('app:build-assets', function (callback, proj, dest, debug) {
    var gulp = new Gulp.Gulp();
    var rawFiles = [Path.join(importPath, '*/*/*'), '!' + Path.join(importPath, '*/*/*.js')];
    var assets = [Path.join(importPath, '*/*.json')];

    // build assets
    var sharedTempInfo = new Fire._DeserializeInfo();   // use this obj to create asset refs
    var buildAssets = gulp.src(assets, { base: importPath })
        .pipe(es.map(function (file, callback) {
            // 去掉带有 editor only 标记的对象和属性，同时压缩 json 文件到最小
            sharedTempInfo.reset();
            var obj = Fire.deserialize(file.contents, null, {
                isEditor: false,
                createAssetRefs: true
            });
            if (obj instanceof Fire.Scene) {
                Fire.engine._initScene(obj.scene, function () {
                    file.contents = new Buffer(Editor.serialize(obj, {
                        exporting: true,
                        minify: !debug
                    }));
                    return callback(null, file);
                });
            }
            else {
                file.contents = new Buffer(Editor.serialize(obj, {
                    exporting: true,
                    minify: !debug
                }));
                return callback(null, file);
            }
        }))
        .pipe(gulp.dest(dest));

    // copy raw files
    var copyRawFiles = gulp.src(rawFiles, { base: importPath })
        .pipe(gulp.dest(dest));

    es.merge(buildAssets, copyRawFiles).on('end', callback);
});
