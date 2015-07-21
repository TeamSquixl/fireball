var del = require('del');
var Fs = require('fire-fs');
var git = require('./utils/git.js');
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var mkdirp = require('mkdirp');
var Path = require('path');
var pjson = JSON.parse(Fs.readFileSync('./package.json'));
var shell = require('gulp-shell');
var spawn = require('child_process').spawn;
var chalk = require('chalk');


// require tasks
require('./utils/download-shell');

// public tasks

gulp.task('bootstrap', gulpSequence(['init-submodules', 'install-builtin', 'install-runtime', 'install-shared-packages'], 'update-electron'));

gulp.task('update', gulpSequence('pull-fireball', 'checkout-submodules', 'pull-submodules', ['update-builtin', 'update-shared-packages', 'update-runtime'], 'remove-builtin-bin', 'update-electron', 'build-engine', 'check-dependencies'));

gulp.task('run', ['run-electron']);

gulp.task('fireball', ['run-canvasstudio']);

gulp.task('package-studio', ['run-packagestudio']);

gulp.task('make-dist-mac', gulpSequence('rename-electron-mac', 'copy-app-dist', 'flatten-modules'));

gulp.task('make-dist-win', gulpSequence('rename-electron-win', 'copy-app-dist', 'flatten-modules'));

// run
gulp.task('run-electron', function(cb) {
    var cmdStr = '';
    var optArr = [];
    if (process.platform === "win32") {
        cmdStr = 'bin\\electron\\electron.exe';
        optArr = ['.\\', '--debug=3030', '--dev', '--show-devtools'];
    } else {
        cmdStr = 'bin/electron/Electron.app/Contents/MacOS/Electron';
        optArr = ['./', '--debug=3030', '--dev', '--show-devtools'];
    }
    var child = spawn(cmdStr, optArr, {
        stdio: 'inherit'
    });
    child.on('exit', function() {
        cb();
    });
});

gulp.task('run-packagestudio', function(cb) {
    var Commander = require('commander');
    Commander.option('--path <path>', 'Run packages in path')
        .parse(process.argv);

    var packagePath = Commander.path;
    if (packagePath) {
        console.log('Load packages from %s', packagePath);
    } else {
        console.log('Please provide a valid project path with "--path" arguments');
    }

    var cmdStr = '';
    var optArr = [];
    if (process.platform === "win32") {
        cmdStr = 'bin\\electron\\electron.exe';
        optArr = ['.\\', '--debug=3030', '--dev', '--dev-mode=packages', '--show-devtools', packagePath];
    } else {
        cmdStr = 'bin/electron/Electron.app/Contents/MacOS/Electron';
        optArr = ['./', '--debug=3030', '--dev', '--dev-mode=packages', '--show-devtools', packagePath];
    }

    var child = spawn(cmdStr, optArr, {
        stdio: 'inherit'
    });
    child.on('exit', function() {
        cb();
    });
});

gulp.task('run-canvasstudio', function(cb) {
    var Commander = require('commander');
    Commander.option('--path <path>', 'Run open fireball project in path')
        .parse(process.argv);

    var projectPath = Commander.path;
    if (projectPath) {
        console.log('Load project from %s', projectPath);
    }

    var cmdStr = '';
    var optArr = [];
    if (process.platform === "win32") {
        cmdStr = 'bin\\electron\\electron.exe';
        optArr = ['.\\', '--debug=3030', '--dev', '--show-devtools', projectPath];
    } else {
        cmdStr = 'bin/electron/Electron.app/Contents/MacOS/Electron';
        optArr = ['./', '--debug=3030', '--dev', '--show-devtools', projectPath];
    }

    var child = spawn(cmdStr, optArr, {
        stdio: 'inherit'
    });
    child.on('exit', function() {
        cb();
    });
});

// build 

gulp.task('build-engine', function(cb) {
    var buildPaths = ['engine-framework', 'runtime/runtime-cocos2d-js'];
    var count = buildPaths.length;
    var cmdStr = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';  
    function doBuild (cwd, done) {
        console.log("Start building " + chalk.green(cwd));
        var child = spawn(cmdStr, ['build'], {
            cwd: cwd,
            stdio: 'inherit'
        });
        child.on('exit', function() {
            console.log("Finish building " + chalk.green(cwd));
            return done();
        });
    }
    
    buildPaths.forEach(function(path) {
        doBuild(path, function() {
            if (--count<=0) {
                console.log(chalk.green("Engine build complete!"));
                cb();
            }
        });
    });
});

gulp.task('init-submodules', function(cb) {
    git.runGitCmdInPath(['submodule', 'update', '--init'], './', function() {
        console.log('Git submodules inited!');
        cb();
    });
});

gulp.task('pull-fireball', function(cb) {
    git.runGitCmdInPath(['pull', 'https://github.com/fireball-x/fireball.git', 'dev'], './', function() {
        console.log('Fireball update complete!');
        git.runGitCmdInPath(['fetch', '--all'], './', function() {
            console.log('Remote head updated!');
            cb();
        });
    });
});

gulp.task('checkout-submodules', function(cb) {
    var modules = pjson.submodules;
    var count = modules.length;
    modules.forEach(function(module) {
        if (Fs.existsSync(Path.join(module, '.git'))) {
            git.runGitCmdInPath(['checkout', 'master'], module, function() {
                if (--count <= 0) {
                    console.log('Git submodules checkout to master complete!');
                    cb();
                }
            });
        } else {
            console.log(module + ' not initialized. Please run "gulp init-submodules" first!');
            return cb();
        }
    });
});

gulp.task('pull-submodules', function(cb) {
    var modules = pjson.submodules;
    var count = modules.length;
    modules.map(function(module) {
        if (Fs.existsSync(Path.join(module, '.git'))) {
            git.runGitCmdInPath(['pull', 'origin', 'master'], module, function() {
                if (--count <= 0) {
                    console.log('Git submodules pull complete!');
                    cb();
                }
            });
        } else {
            console.log(module + ' not initialized. Please run "gulp init-submodules" first!');
            return cb();
        }
    });
});

gulp.task('install-builtin', function(cb) {
    var count = pjson.builtins.length;
    if (Fs.isDirSync('builtin')) {
        pjson.builtins.map(function(packageName) {
            if (!Fs.existsSync(Path.join('builtin', packageName, '.git'))) {
                git.runGitCmdInPath(['clone', 'https://github.com/fireball-packages/' + packageName], 'builtin', function() {
                    if (--count <= 0) {
                        console.log('Builtin packages installation complete!');
                        cb();
                    }
                });
            } else {
                console.log(packageName + ' has already installed in builtin/' + packageName + ' folder!');
                if (--count <= 0) {
                    cb();
                }
            }
        });
    } else {
        mkdirp('builtin');
        pjson.builtins.map(function(packageName) {
            count++;
            git.runGitCmdInPath(['clone', 'https://github.com/fireball-packages/' + packageName], 'builtin', function() {
                if (--count <= 0) {
                    console.log('Builtin packages installation complete!');
                    cb();
                }
            });
        });
    }
});

gulp.task('update-builtin', function(cb) {
    var count = 0;
    if (Fs.isDirSync('builtin')) {
        pjson.builtins.forEach(function(packageName) {
            if (Fs.existsSync(Path.join('builtin', packageName, '.git'))) {
                count++;
                git.runGitCmdInPath(['pull', 'https://github.com/fireball-packages/' + packageName, 'master'], Path.join('builtin', packageName), function() {
                    git.runGitCmdInPath(['fetch', '--all'], Path.join('builtin', packageName), function() {
                        console.log('Remote head updated!');
                        if (--count <= 0) {
                            console.log('Builtin packages update complete!');
                            return cb();
                        }
                    });
                });
            } else {
                console.error(chalk.red('Builtin package ' + packageName + ' not initialized, please run "gulp install-builtin" first!'));
                process.exit(1);
            }
        });
    } else {
        console.error(chalk.red('Builtin folder not initialized, please run "gulp install-builtin" first!'));
        return cb();
    }
});

gulp.task('install-runtime', function(cb) {
    var count = pjson.runtimes.length;
    if (Fs.isDirSync('runtime')) {
        pjson.runtimes.map(function(runtimeName) {
            if (!Fs.existsSync(Path.join('runtime', runtimeName, '.git'))) {
                git.runGitCmdInPath(['clone', 'https://github.com/fireball-x/' + runtimeName], 'runtime', function() {
                    if (--count <= 0) {
                        console.log('Runtime engines installation complete!');
                        cb();
                    }
                });
            } else {
                console.log(runtimeName + ' has already installed in runtime/' + runtimeName + ' folder!');
                if (--count <= 0) {
                    console.log(count);
                    cb();
                }
            }
        });
    } else {
        mkdirp('runtime');
        pjson.runtimes.map(function(runtimeName) {
            count++;
            git.runGitCmdInPath(['clone', 'https://github.com/fireball-x/' + runtimeName], 'runtime', function() {
                if (--count <= 0) {
                    console.log('Runtime engines installation complete!');
                    cb();
                }
            });
        });
    }
});

gulp.task('update-runtime', function(cb) {
    var count = 0;
    if (Fs.isDirSync('runtime')) {
        pjson.runtimes.map(function(runtimeName) {
            if (Fs.existsSync(Path.join('runtime', runtimeName, '.git'))) {
                count++;
                git.runGitCmdInPath(['pull', 'https://github.com/fireball-x/' + runtimeName, 'master'], Path.join('runtime', runtimeName), function() {
                    git.runGitCmdInPath(['fetch', '--all'], Path.join('runtime', runtimeName), function() {
                        console.log('Remote head updated!');
                        if (--count <= 0) {
                            console.log('Runtime engines update complete!');
                            cb();
                        }
                    });
                });
            } else {
                console.error(chalk.red('Runtime engine ' + runtimeName + ' not initialized, please run "gulp install-runtime" first!'));
                process.exit(1);
            }
        });
    } else {
        console.error(chalk.red('Runtime folder not initialized, please run "gulp install-runtime" first!'));
        return cb();
    }
});

gulp.task('install-shared-packages', function(cb) {
    var pkgs = pjson.sharedPackages;
    var count = pkgs.length;
    pkgs.forEach(function(pkg) {
        if (!Fs.existsSync(Path.join(pkg, '.git'))) {
            git.runGitCmdInPath(['clone', 'https://github.com/fireball-packages/' + pkg], './', function() {
                git.runGitCmdInPath(['fetch', '--all'], pkg, function() {
                    console.log('Remote head updated!');
                    if (--count <= 0) {
                        console.log('Shared packages installation complete!');
                        cb();
                    }
                });
            });
        } else {
            console.log(pkg + ' has already installed in ./' + pkg + ' folder!');
            if (--count <= 0) {
                console.log('Shared packages installation complete!');
                cb();
            }
        }
    });
});

gulp.task('update-shared-packages', function(cb) {
    var pkgs = pjson.sharedPackages;
    var count = pkgs.length;
    pkgs.forEach(function(pkg) {
        if (Fs.existsSync(Path.join(pkg, '.git'))) {
            git.runGitCmdInPath(['pull', 'https://github.com/fireball-packages/' + pkg, 'master'], pkg, function() {
                git.runGitCmdInPath(['fetch', '--all'], pkg, function() {
                    console.log('Remote head updated!');
                    if (--count <= 0) {
                        console.log('Shared packages update complete!');
                        cb();
                    }
                });
            });
        } else {
            console.warn(chalk.red('Shared package ' + pkg + ' not initialized, please run "gulp install-shared-packages" first!'));
            if (--count <= 0) {
                cb();
            }
        }
    });
});

function findNativeModulePathRecursive(path) {
    var nativePaths = [];
    if (Fs.existsSync(Path.join(path, 'binding.gyp'))) {
        nativePaths.push(path);
    } else {
        if (Fs.isDirSync(Path.join(path, 'node_modules'))) {
            var subPaths = Fs.readdirSync(Path.join(path, 'node_modules'));
            subPaths.forEach(function(subpath) {
                var subCollect = findNativeModulePathRecursive(Path.join(path, 'node_modules', subpath));
                if (subCollect.length > 0) {
                    nativePaths = nativePaths.concat(subCollect);
                }
            });
        }
    }
    return nativePaths;
}

gulp.task('npm-rebuild', function(cb) {
    var cmdstr;
    var tmpenv = process.env;
    var arch;
    if (process.platform === 'win32') {
        cmdstr = 'node-gyp.cmd';
        tmpenv.HOME = Path.join(tmpenv.HOMEPATH, '.electron-gyp');
        arch = 'ia32';
    } else {
        cmdstr = 'node-gyp';
        tmpenv.HOME = Path.join(tmpenv.HOME, '.electron-gyp');
        var os = require('os');
        arch = os.arch();
    }
    var disturl = 'https://atom.io/download/atom-shell';
    var target = pjson.electronVersion;
    // var arch = process.platform === 'win32' ? 'ia32' : 'x64';
    var nativePaths = findNativeModulePathRecursive('.');
    console.log('rebuilding native modules: \n' + nativePaths);
    var count = nativePaths.length;
    if (count === 0) {
        console.log('no native module found!');
        return cb();
    }
    nativePaths.forEach(function(path) {
        var child = spawn(cmdstr, [
            'rebuild', '--target='+target,
            '--arch='+arch, '--dist-url='+disturl
            ], {
            stdio: 'inherit',
            env: tmpenv,
            cwd: path
        });
        child.on('exit', function() {
            if (--count <= 0) {
                cb();
            }
        });
    });
});

gulp.task('check-deps', function(cb) {
    var checkDeps = require('./utils/check-deps');
    checkDeps.checkSubmoduleDeps(pjson.submodules);
});

gulp.task('cp-apisrc', ['del-apidocs'], function() {
    var es = require('event-stream');
    var header = require('gulp-header');
    var cpEditor = gulp.src([
            "./editor-framework/init.js",
            "./editor-framework/core/*",
            "./editor-framework/share/*",
            "./editor-framework/page/*"
        ], {
            base: "./editor-framework"
        })
        .pipe(gulp.dest("utils/api/editor-framework"));


    var DefaultModuleHeader = "/**\n" +
                              " * @module Fire\n" +
                              " */\n";

    var cpEngine = gulp.src([
            "src/**/*"
        ], {
            cwd: "./engine-framework"
        })
        .pipe(header(DefaultModuleHeader))
        .pipe(gulp.dest("utils/api/engine-framework"));

    return es.merge(cpEditor, cpEngine);
});

gulp.task('del-apidocs', function(cb) {
    del(['./apidocs', './utils/api'],cb);
});


gulp.task('check-dependencies', function(cb) {
    var checkdeps = require('check-dependencies');
    console.log(chalk.cyan('====Checking Dependencies===='));
    var count = 2;
    checkdeps({
        packageManager: 'npm',
        verbose: true,
        checkGitUrls: true
    }, function() {
        if (--count<=0) {
            console.log('If you see any version number in ' + chalk.red('red') + '. Please run ' + chalk.cyan('"npm install && bower install"') + 'to install missing dependencies');
            cb();
        }
    });
    checkdeps({
        packageManager: 'bower',
        verbose: true,
        checkGitUrls: true
    }, function() {
        if (--count<=0) {
            console.log('If you see any version number in ' + chalk.red('red') + '. Please run ' + chalk.cyan('"npm install && bower install"') + 'to install missing dependencies');
            cb();
        }
    });
});

gulp.task('copy-app-dist', function(cb) {
    var destPath = process.platform === 'win32' ? 'dist/resources/app' : 'dist/Fireball.app/Contents/Resources/app';
    var src = [
        'app.js', 'bower.json', 'License.md', 'package.json',
        'apidocs/**/*', 'builtin/**/*', 'canvas-studio/**/*', 'dashboard/**/*', 'docs/**/*', 'runtime/**/*',
        'share/**/*', 'test/**/*', 'asset-db/**/*', 'engine-framework/**/*', 'editor-framework/**/*', 'bower_components/**/*'
    ];
    var moduleDeps = Object.keys(pjson.dependencies);
    src = src.concat(moduleDeps.map(function(module) {
        return Path.join('node_modules', module, '**/*');
    }));
    return gulp.src(src, {base: './'})
            .pipe(gulp.dest(destPath));
});

gulp.task('flatten-modules', function(cb) {
    var appLoc = process.platform === "win32" ? 'dist/resources/app' : 'dist/Fireball.app/Contents/Resources/app';
    var flatten = require('flatten-packages');
    flatten(appLoc, {}, function (err, res) {
      if (err) console.error(err);
      if (res) return console.log(res);
    });
});

gulp.task('remove-builtin-bin', function(cb) {
    var builtinPaths = pjson.builtins.map(function(entry) {
        return Path.join('builtin', entry);
    });
    var needBuildPaths = builtinPaths.filter(function(entry) {
        var json = JSON.parse(Fs.readFileSync(Path.join(entry, 'package.json')));
        if (json.build){
            return true;
        } else {
            return false;
        }
    });
    console.log('Clean built files for ' + needBuildPaths);
    var needBuildBin = needBuildPaths.map(function(entry){
        return Path.join(entry, 'bin');
    });
    del(needBuildBin, function(err) {
        if (err) throw err;
        else {
            console.log('Builtin Packages Cleaned! Will be rebuilt when Fireball launches.');
            cb();
        }
    });
});
