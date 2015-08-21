var Path = require('fire-path');
var os = require('os');
var fs = require('fire-fs');
var del = require('del');
var format = require('util').format;

var Gulp = require('gulp').Gulp;

var gutil = require('gulp-util');
var es = require('event-stream');

var compiler = require('./compiler');

// 有且只有平台所属的 task 以 build-platform_ 开头
var BUILD_ = 'build-platform_';

exports.startWithArgs = function (ipcProxy, opts, callback) {

    var gulp = new Gulp();     // create a gulp instance

    /////////////////////////////////////////////////////////////////////////////
    // parse args
    /////////////////////////////////////////////////////////////////////////////

    var proj = opts.project;
    var platform = opts.platform;
    var dest = opts.dest;
    var debug = opts.debug;
    var cwd = Editor.appPath;

    var standaloneBuild = platform !== 'web-preview';

    if (standaloneBuild) {
        //proj = Path.resolve(proj);
        console.log('Building ' + proj);

        //dest = Path.resolve(dest);
        console.log('Destination ' + dest);
    }

    if (Path.normalize(dest) === Path.normalize(proj)) {
        return callback( new Error('Can not export project at project folder.') );
    }

    if (Path.contains(Editor.appPath, dest)) {
        return callback( new Error('Can not export project to fireball app folder.') );
    }

    // configs
    var runtimePkg = require(Path.join(opts.runtimePath, 'package.json'));
    var runtimeScripts = debug ? runtimePkg.build.scriptsDev : runtimePkg.build.scriptsMin;
    var engine = debug ? 'engine-framework/bin/engine-framework.js' : 'engine-framework/bin/engine-framework.min.js';

    var tmplBase = Path.resolve(cwd, 'canvas-studio/static/build-templates');
    var paths = {
        template_shares: Path.join(tmplBase, 'shares/**/*'),
        template_web_desktop: Path.join(tmplBase, debug ? 'web-desktop/template-dev/**/*' : 'web-desktop/template/**/*'),
        template_web_mobile: Path.join(tmplBase, debug ? 'web-mobile/template-dev/**/*' : 'web-mobile/template/**/*'),
        template_web_preview: Path.join(tmplBase, 'web-mobile/template-dev/**/*'),
        script: debug ? 'project.dev.js' : 'project.js',
        runtimeScripts: runtimeScripts.map(function (path) {
            return Path.resolve(opts.runtimePath, path);
        }),
        engine: Path.resolve(cwd, engine),
        res: Path.join(dest, 'resource'),
        settings: Path.join(dest, 'settings.js')
    };
    paths.scriptsToCopy = [paths.engine].concat(paths.runtimeScripts);

    //if (opts.resUuid) {
    //    paths.res = Path.join(paths.res, opts.resUuid);
    //}

    /////////////////////////////////////////////////////////////////////////////
    // tasks
    /////////////////////////////////////////////////////////////////////////////

    // copy-scripts
    gulp.task('copy-scripts', function () {
        return gulp.src(paths.scriptsToCopy)
            .pipe(gulp.dest(dest));
    });

    if (standaloneBuild) {
        // compile for current platform
        gulp.task('compile', function (done) {
            Editor.sendToWindows('builder:state-changed', 'compile', 0.1);
            var args = {
                project: proj,
                platform: platform,
                dest: Path.join(dest, paths.script),
                debug: debug
            };
            // run!
            compiler.doCompile(args, function (err) {
                if (err) {
                    if (gulp.isRunning) {
                        gulp.stop(err);
                    }
                    else {
                        Editor.error(err);
                    }
                }
                else {
                    done();
                }
            });
        });
    }
    else {
        gulp.task('copy-compiled', function (done) {
            var src = Path.resolve(proj, 'library/bundle.project.js');
            var dst = Path.join(dest, paths.script);
            fs.exists(src, function (exists) {
                if (exists) {
                    fs.copy(src, dst, done);
                }
                else {
                    var err = new Error('Can not find compiled script');
                    if (gulp.isRunning) {
                        gulp.stop(err);
                    }
                    else {
                        Editor.error(err);
                    }
                }
            });
        });
    }

    if (standaloneBuild) {
        // build assets
        gulp.task('build-assets', ['compile'], function (done) {
            Editor.sendToWindows('builder:state-changed', 'spawn-worker', 0.3);

            var pageWorker;
            var ErrorEvent = 'app:build-project-abort';
            function errorListener (err) {
                if (pageWorker) {
                    var toDestroy = pageWorker;
                    pageWorker = null;  // marked as destroying
                    toDestroy.nativeWin.destroy();
                }
                if (gulp.isRunning) {
                    done(new Error(err));
                }
                else {
                    Editor.error(err);
                }
            }
            ipcProxy.once(ErrorEvent, errorListener);

            pageWorker = Editor.App.spawnWorker('app://canvas-studio/page/build-worker', function (browser) {
                var aborted;
                browser.once('closed', function () {
                    if (!aborted) {
                        ipcProxy.removeListener(ErrorEvent, errorListener);
                        done();
                    }
                });
                Editor.sendToWindows('builder:state-changed', 'init-worker', 0.32);
                // use sendRequestToPage since disallow to use ipc here
                pageWorker.sendRequestToPage('app:init-build-worker', function (err) {
                    if (err) {
                        if (gulp.isRunning) {
                            gulp.stop(err);
                        }
                        else {
                            Editor.error(err);
                        }
                        aborted = true;
                        var destroyingWorker = !pageWorker;
                        if (!destroyingWorker) {
                            pageWorker.close();
                            pageWorker = null;
                        }
                    }
                    else if (pageWorker) {
                        Editor.sendToWindows('builder:state-changed', 'build-assets', 0.8);
                        pageWorker.sendRequestToPage('app:build-assets', proj, paths.res, opts.rawAssets, debug, function (err) {
                            var destroyingWorker = !pageWorker;
                            if (!destroyingWorker) {
                                pageWorker.close();
                                pageWorker = null;
                            }
                        });
                    }
                });
            });
        });
    }

    // build project settings
    gulp.task('build-settings', ['copy-scripts'/*, 'res-setting'*/],    // wait until dest folder created

        function (done) {

            var settings = {
                scenes: [],
                launchScene: '',
                rawAssets: {},
                resBundle: opts.resBundle,
                platform: platform,
                designWidth: opts.designWidth,
                designHeight: opts.designHeight,
            };
            // scenes
            var scenes = opts.scenes;
            settings.launchScene = scenes[0].url;
            settings.scenes = scenes;

            // rawAssets
            var unImportedAssets = opts.unImportedAssets;
            var base = Path.join(Editor.projectPath, 'assets');
            var uuidToUrl = {};
            for (var uuid in unImportedAssets) {
                var isRaw = unImportedAssets[uuid];
                var path = Editor.assetdb.uuidToFspath(uuid);
                if (path) {
                    path = Path.relative(base, path);
                    var url = path.replace(/\\/g, '/');
                    if (debug) {
                        uuidToUrl[uuid] = {
                            url: url,
                            raw: isRaw
                        };
                    }
                    else {
                        if (isRaw) {
                            uuidToUrl[uuid] = url;
                        }
                        else {
                            uuidToUrl[uuid] = [url];
                        }
                    }
                }
            }
            settings.rawAssets = uuidToUrl;

            // write config
            var json = JSON.stringify(settings, null, debug ? 4 : 0);
            if (debug) {
                json = "_FireSettings = " + json + ';\n';
            }
            else {
                json = "_FireSettings=" + json;
            }
            fs.writeFile(paths.settings, json, done);
        }
    );

    function buildHtml(src, callback) {
        return gulp.src([paths.template_shares].concat(src))
            .pipe(es.through(function write(file) {
                if (Path.extname(file.path) === '.html') {
                    if (standaloneBuild) {
                        console.log('generating html from ' + file.path);
                    }
                    var scriptElements = '';
                    for (var i = 0; i < paths.runtimeScripts.length; i++) {
                        var scriptPath = paths.runtimeScripts[i];
                        if (scriptPath) {
                            if (scriptElements.length > 0) {
                                scriptElements += '\r\n    ';
                            }
                            src = Path.basename(scriptPath);
                            scriptElements += format('<script src="%s"></script>', src);
                        }
                    }
                    var data = {
                        file: file,
                        project: opts.projectName || Path.basename(proj),
                        runtimeScript: scriptElements,
                    };
                    file.contents = new Buffer(gutil.template(file.contents, data));
                }
                this.emit('data', file);
            }))
            .pipe(gulp.dest(dest))
            .on('end', callback);
    }

    gulp.task(BUILD_ + 'web-desktop',
        [
            'compile',
            'copy-scripts',
            'build-assets',
            'build-settings'
        ],
        function (done) {
            buildHtml(paths.template_web_desktop, done);
        }
    );

    gulp.task(BUILD_ + 'web-mobile',
        [
            'compile',
            'copy-scripts',
            'build-assets',
            'build-settings'
        ],
        function (done) {
            buildHtml(paths.template_web_mobile, done);
        }
    );

    //gulp.task(BUILD_ + 'web-preview',
    //    [
    //        'copy-compiled',
    //        'copy-scripts',
    //        'build-settings'
    //    ],
    //    function (done) {
    //        buildHtml(paths.template_web_preview, done);
    //    }
    //);

    gulp.task(BUILD_ + 'native-mac',
        [
            'compile',
            'copy-scripts',
            'build-assets',
            'build-settings'
        ],
        function (done) {
            buildHtml(paths.template_web_desktop, done);
        }
    );

    if (standaloneBuild) {

        /////////////////////////////////////////////////////////////////////////////
        // make server
        /////////////////////////////////////////////////////////////////////////////

        var hostRoot = Path.join(os.tmpdir(), 'fireball-game-builds');
        gulp.task('clean-built-target', function(cb) {
            if (fs.existsSync(hostRoot)) {
                del(hostRoot + '/**/*', { force: true }, cb);
            }
            else {
                cb();
            }
        });

        gulp.task('copy-built-target', ['clean-built-target'], function() {
            console.log('built files copying to: ' + hostRoot);
            return gulp.src(dest + '/**/*')
                .pipe(gulp.dest(hostRoot));
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // run task
    /////////////////////////////////////////////////////////////////////////////

    var buildTask = BUILD_ + platform;
    if (buildTask in gulp.tasks) {
        gulp.start(buildTask, function (err) {
            if (err) {
                callback(err);
            }
            else if (standaloneBuild) {
                gulp.start('copy-built-target', callback);
            }
            else {
                callback();
            }
        });
    }
    else {
        var availables = [];
        for (var key in gulp.tasks) {
            if (key.indexOf(BUILD_) === 0) {
                availables.push(key.substring(BUILD_.length));
            }
        }
        callback( new Error(format('Not support %s platform, available platform currently: %s', platform, availables) ));
    }

};
