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

exports.startWithArgs = function (opts, callback) {

    /////////////////////////////////////////////////////////////////////////////
    // parse args
    /////////////////////////////////////////////////////////////////////////////

    var gulp = new Gulp();     // create a gulp instance

    var proj = opts.project;
    var platform = opts.platform;
    var dest = opts.dest;
    var debug = opts.debug;
    var cwd = Editor.appPath;

    //proj = Path.resolve(proj);
    console.log('Building ' + proj);

    //dest = Path.resolve(dest);
    console.log('Destination ' + dest);

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
        script: debug ? 'project.dev.js' : 'project.js',
        runtimeScripts: runtimeScripts.map(function (path) {
            return Path.resolve(opts.runtimePath, path);
        }),
        engine: Path.resolve(cwd, engine),
        res: Path.join(dest, 'resource'),
        settings: Path.join(dest, 'settings.json')
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

    // build assets
    gulp.task('build-assets', ['compile'], function (done) {
        Editor.sendToWindows('builder:state-changed', 'spawn-worker', 0.3);
        var pageWorker = Editor.App.spawnWorker('app://canvas-studio/page/build-worker', function (browser) {
            var aborted;
            browser.once('closed', function () {
                if (!aborted) {
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
                    pageWorker.close();
                }
                else {
                    Editor.sendToWindows('builder:state-changed', 'build-assets', 0.8);
                    pageWorker.sendRequestToPage('app:build-assets', proj, paths.res, debug, function () {
                        pageWorker.close();
                    });
                }
            });
        });
    });

    // build project settings
    gulp.task('build-settings', ['copy-scripts'/*, 'res-setting'*/],    // wait until dest folder created
        function (done) {
            var settings = {
                scenes: {},
                launchScene: '',
                resBundle: opts.resBundle
            };
            // scenes
            var scenes = opts.scenes;
            settings.launchScene = scenes[0].name;
            for (var i = 0; i < scenes.length; i++) {
                var item = scenes[i];
                settings.scenes[item.name] = item.uuid;
            }

            // write config
            var json = JSON.stringify(settings, null, debug ? 4 : 0);
            fs.writeFile(paths.settings, json, done);
        }
    );

    // build html
    function buildAndCopyWeb(src, callback) {
        return gulp.src([paths.template_shares].concat(src))
            .pipe(es.through(function write(file) {
                if (Path.extname(file.path) === '.html') {
                    console.log('generating html from ' + file.path);
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

    // web-desktop
    gulp.task(BUILD_ + 'web-desktop',
        [
            'compile',
            'copy-scripts',
            'build-assets',
            'build-settings'
        ],
        function (done) {
            buildAndCopyWeb(paths.template_web_desktop, done);
        }
    );

    // web-mobile
    gulp.task(BUILD_ + 'web-mobile',
        [
            'compile',
            'copy-scripts',
            'build-assets',
            'build-settings'
        ],
        function (done) {
            buildAndCopyWeb(paths.template_web_mobile, done);
        }
    );


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

    /////////////////////////////////////////////////////////////////////////////
    // run task
    /////////////////////////////////////////////////////////////////////////////

    var buildTask = BUILD_ + platform;
    if (buildTask in gulp.tasks) {
        gulp.start(buildTask, function (err) {
            if (err) {
                callback(err);
            }
            else {
                gulp.start('copy-built-target', callback);
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
