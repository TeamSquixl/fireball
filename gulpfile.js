var Fs = require('fire-fs');
var Path = require('path');
var Del = require('del');
var Chalk = require('chalk');
var Npmconf = require('npmconf');

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

var git = require('./utils/libs/git.js');
var pjson = JSON.parse(Fs.readFileSync('./package.json'));
var spawn = require('child_process').spawn;

// require tasks
require('./utils/gulp-tasks/electron-tasks');
require('./utils/gulp-tasks/setup-tasks');

// init and update
// =====================================

gulp.task('bootstrap',
    gulpSequence([
        'init-submodules',
        'install-builtin',
        'install-runtime',
        'install-shared-packages'
    ], 'update-electron')
);

gulp.task('update',
    gulpSequence(
        'setup-branch',
        'update-fireball',
        'checkout-submodules',
        'pull-submodules', [
            'update-builtin',
            'update-shared-packages',
            'update-runtime'
        ],
        'remove-builtin-bin',
        'update-electron',
        'build-engine',
        'check-dependencies'
    )
);

gulp.task('pre-install-npm', ['setup-mirror'], function(cb) {
    var mirror = JSON.parse(Fs.readFileSync('local-setting.json')).mirror;
    Npmconf.load(function(_, conf) {
        var registry = Npmconf.defaults.registry;
        if (mirror === 'china') {
            registry = 'http://registry.npm.taobao.org/';
        }
        conf.set('registry', registry, 'user');
        conf.save('user', cb);
    });
});

gulp.task('post-install-npm', function(cb) {
    // resume the default config when being installed
    Npmconf.load(function(_, conf) {
        conf.set('registry', Npmconf.defaults.registry, 'user');
        conf.save('user', cb);
    });
});

// run
// =====================================

gulp.task('run', function(cb) {
    var cmdStr = '';
    var optArr = [];
    if (process.platform === 'win32') {
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

gulp.task('package-studio', function(cb) {
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
    if (process.platform === 'win32') {
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

gulp.task('fireball', function(cb) {
    var Commander = require('commander');
    Commander.option('--path <path>', 'Run open fireball project in path')
        .parse(process.argv);

    var projectPath = Commander.path;
    if (projectPath) {
        console.log('Load project from %s', projectPath);
    }

    var cmdStr = '';
    var optArr = [];
    if (process.platform === 'win32') {
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

// self
// =====================================

gulp.task('update-fireball', function(cb) {
    var Async = require('async');

    Async.series([
        function ( next ) {
            git.exec(['pull', 'https://github.com/fireball-x/fireball.git', 'dev'], './', next);
        },

        function ( next ) {
            console.log('Fireball update complete!');
            git.exec(['fetch', '--all'], './', next);
        },

        function ( next ) {
            // NOTE: when we update the main project, we should reload its package.json
            pjson = JSON.parse(Fs.readFileSync('./package.json'));
            next();
        },

    ], function ( err ) {
        if ( err ) throw err;
        cb ();
    });
});

// submodules
// =====================================

gulp.task('init-submodules', function(cb) {
    git.exec(['submodule', 'update', '--init'], './', function() {
        console.log('Git submodules inited!');
        cb();
    });
});

gulp.task('checkout-submodules', function(cb) {
    var modules = pjson.submodules;
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));
    var count = modules.length;
    modules.forEach(function(module) {
        if (Fs.existsSync(Path.join(module, '.git'))) {
            var branch = 'master';
            if ( setting.branch.submodules ) {
                branch = setting.branch.submodules.name || 'master';
            }

            git.exec(['checkout', branch], module, function() {
                if (--count <= 0) {
                    console.log('Git submodules checkout to ' + branch + ' complete!');
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
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));
    modules.map(function(module) {
        if (Fs.existsSync(Path.join(module, '.git'))) {
            var branch = setting.branch.submodules[module];
            git.exec(['pull', 'origin', branch], module, function() {
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

// builtin
// =====================================

gulp.task('install-builtin', function(cb) {
    Fs.ensureDirSync('builtin');

    var Async = require('async');
    Async.eachLimit( pjson.builtins, 5, function ( name, done ) {
        git.clone('https://github.com/fireball-packages/' + name,
                  Path.join('builtin', name),
                  done);
    }, function ( err ) {
        console.log('Builtin packages installation complete!');
        cb();
    });
});

gulp.task('update-builtin', function(cb) {
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));

    if ( !Fs.isDirSync('builtin') ) {
        console.error(Chalk.red('Builtin folder not initialized, please run "gulp install-builtin" first!'));
        return cb();
    }

    var Async = require('async');
    Async.eachLimit( pjson.builtins, 5, function ( name, done ) {
        if ( !Fs.existsSync(Path.join('builtin', name, '.git')) ) {
            console.error(Chalk.red('Builtin package ' + name + ' not initialized, please run "gulp install-builtin" first!'));
            process.exit(1);
            return;
        }

        var branch = 'master';
        if ( setting.branch.builtins ) {
            branch = setting.branch.builtins.name || 'master';
        }

        git.pull(Path.join('builtin', name),
                 'https://github.com/fireball-packages/' + name,
                 branch,
                 done);
    }, function ( err ) {
        if ( err ) {
            process.exit(1);
            return;
        }

        console.log('Builtin packages update complete!');
        return cb();
    });
});

gulp.task('push-builtin', function(cb) {
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));

    if ( !Fs.isDirSync('builtin') ) {
        console.error(Chalk.red('Builtin folder not initialized, please run "gulp install-builtin" first!'));
        return cb();
    }

    var Async = require('async');
    Async.eachLimit( pjson.builtins, 5, function ( name, done ) {
        if ( !Fs.existsSync(Path.join('builtin', name, '.git')) ) {
            console.error(Chalk.red('Builtin package ' + name + ' not initialized, please run "gulp install-builtin" first!'));
            process.exit(1);
            return;
        }

        var branch = 'master';
        if ( setting.branch.builtins ) {
            branch = setting.branch.builtins.name || 'master';
        }

        git.push(Path.join('builtin', name),
                 'https://github.com/fireball-packages/' + name,
                 branch,
                 done);
    }, function ( err ) {
        if ( err ) {
            process.exit(1);
            return;
        }

        console.log('Builtin packages update complete!');
        return cb();
    });
});

gulp.task('remove-builtin-bin', function(cb) {
    var bins = pjson.builtins.filter(function(name) {
        var json = JSON.parse(Fs.readFileSync(Path.join('builtin', name, 'package.json')));
        return json.build;
    }).map(function (name) {
        return Path.join('builtin', name, 'bin');
    });

    console.log('Clean built files for ' + bins);
    Del(bins, function(err) {
        if (err) {
            throw err;
        }

        console.log('Builtin Packages Cleaned! Will be rebuilt when Icebolt launches.');
        cb();
    });
});

gulp.task('prune-builtin', function(cb) {
    var results = Fs.readdirSync('builtin').filter(function ( name ) {
        return pjson.builtins.indexOf(name) === -1;
    });

    results = results.map(function ( name ) {
        return Path.join( 'builtin', name );
    });

    Del( results, function ( err ) {
        if (err) {
            throw err;
        }

        results.forEach( function (name) {
            console.log( 'Prune builtin package ' + name );
        });

        cb();
    });
});

// runtime
// =====================================

gulp.task('install-runtime', function(cb) {
    Fs.ensureDirSync('runtime');

    var Async = require('async');
    Async.eachLimit( pjson.runtimes, 5, function ( name, done ) {
        git.clone('https://github.com/fireball-x/' + name,
                  Path.join('runtime', name),
                  done);
    }, function ( err ) {
        console.log('Runtime engines installation complete!');
        cb();
    });
});

gulp.task('update-runtime', function(cb) {
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));

    if ( !Fs.isDirSync('runtime') ) {
        console.error(Chalk.red('Runtime folder not initialized, please run "gulp install-runtime" first!'));
        return cb();
    }

    var Async = require('async');
    Async.eachLimit( pjson.runtimes, 5, function ( name, done ) {
        if ( !Fs.existsSync(Path.join('runtime', name, '.git')) ) {
            console.error(Chalk.red('Runtime engine ' + name + ' not initialized, please run "gulp install-runtime" first!'));
            process.exit(1);
            return;
        }

        var branch = 'master';
        if ( setting.branch.runtimes ) {
            branch = setting.branch.runtimes.name || 'master';
        }

        git.pull(Path.join('runtime', name),
                 'https://github.com/fireball-x/' + name,
                 branch,
                 done);
    }, function ( err ) {
        if ( err ) {
            process.exit(1);
            return;
        }

        console.log('Runtime engines update complete!');
        return cb();
    });
});

// shared-packages
// =====================================

gulp.task('install-shared-packages', function(cb) {
    var Async = require('async');
    Async.eachLimit( pjson.sharedPackages, 5, function ( name, done ) {
        git.clone('https://github.com/fireball-packages/' + name,
                  name,
                  done);
    }, function ( err ) {
        console.log('Shared packages installation complete!');
        cb();
    });
});

gulp.task('update-shared-packages', function(cb) {
    var setting = JSON.parse(Fs.readFileSync('local-setting.json'));

    var Async = require('async');
    Async.eachLimit( pjson.sharedPackages, 5, function ( name, done ) {
        if ( !Fs.existsSync(Path.join(name, '.git')) ) {
            console.error(Chalk.red('Shared package ' + name + ' not initialized, please run "gulp install-shared-packages" first!'));
            process.exit(1);
            return;
        }

        var branch = 'master';
        if ( setting.branch.sharedPackages ) {
            branch = setting.branch.sharedPackages.name || 'master';
        }

        git.pull(name,
                 'https://github.com/fireball-packages/' + name,
                 branch,
                 done);
    }, function ( err ) {
        if ( err ) {
            process.exit(1);
            return;
        }

        console.log('Shared packages update complete!');
        return cb();
    });
});

// build
// =====================================

gulp.task('build-engine', function(cb) {
    var buildPaths = ['engine-framework', 'runtime/runtime-cocos2d-js'];
    var count = buildPaths.length;
    var cmdStr = process.platform === 'win32' ? 'gulp.cmd' : 'gulp';
    function doBuild (cwd, done) {
        console.log('Start building ' + Chalk.green(cwd));
        var child = spawn(cmdStr, ['build'], {
            cwd: cwd,
            stdio: 'inherit'
        });
        child.on('exit', function() {
            console.log('Finish building ' + Chalk.green(cwd));
            return done();
        });
    }

    buildPaths.forEach(function(path) {
        doBuild(path, function() {
            if (--count<=0) {
                console.log(Chalk.green('Engine build complete!'));
                cb();
            }
        });
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

// api
// =====================================

gulp.task('cp-apisrc', ['del-apidocs'], function() {
    var es = require('event-stream');
    var header = require('gulp-header');
    var cpEditor = gulp.src([
            './editor-framework/init.js',
            './editor-framework/core/*',
            './editor-framework/share/*',
            './editor-framework/page/*'
        ], {
            base: './editor-framework'
        })
        .pipe(gulp.dest('utils/api/editor-framework'));


    var DefaultModuleHeader = '/**\n' +
                              ' * @module Fire\n' +
                              ' */\n';

    var cpEngine = gulp.src([
            'src/**/*'
        ], {
            cwd: './engine-framework'
        })
        .pipe(header(DefaultModuleHeader))
        .pipe(gulp.dest('utils/api/engine-framework'));

    var cpAssetDB = gulp.src([
            './asset-db/index.js',
            './asset-db/core/**/*',
            './asset-db/lib/**/*',
            './asset-db/page/**/*',
        ], {
            base: './asset-db/'
        })
        .pipe(gulp.dest('utils/api/asset-db'));

    return es.merge(cpEditor, cpEngine, cpAssetDB);
});

gulp.task('del-apidocs', function(cb) {
    Del(['./apidocs', './utils/api'],cb);
});

// deps
// =====================================

gulp.task('check-hosts-deps', function(cb) {
    var checkDeps = require('./utils/libs/check-deps');
    checkDeps.checkSubmoduleDeps(pjson.submodules);
});

gulp.task('check-dependencies', function(cb) {
    var checkdeps = require('check-dependencies');
    console.log(Chalk.cyan('====Checking Dependencies===='));
    var count = 2;
    checkdeps({
        packageManager: 'npm',
        verbose: true,
        checkGitUrls: true
    }, function() {
        if (--count<=0) {
            console.log('If you see any version number in ' + Chalk.red('red') + '. Please run ' + Chalk.cyan('"npm install && bower install"') + 'to install missing dependencies');
            cb();
        }
    });
    checkdeps({
        packageManager: 'bower',
        verbose: true,
        checkGitUrls: true
    }, function() {
        if (--count<=0) {
            console.log('If you see any version number in ' + Chalk.red('red') + '. Please run ' + Chalk.cyan('"npm install && bower install"') + 'to install missing dependencies');
            cb();
        }
    });
});

gulp.task('copy-app-dist', function(cb) {
    var destPath = process.platform === 'win32' ? 'dist/resources/app' : 'dist/Fireball.app/Contents/Resources/app';
    var src = [
        'License.md',
        'apidocs/**/*',
        'app.js',
        'asset-db/**/*',
        'bower.json',
        'bower_components/**/*',
        'builtin/**/*',
        'canvas-studio/**/*',
        'dashboard/**/*',
        'docs/**/*',
        'editor-framework/**/*',
        'engine-framework/**/*',
        'package.json',
        'runtime/**/*',
        'share/**/*',
        'test/**/*',
    ];
    var moduleDeps = Object.keys(pjson.dependencies);
    src = src.concat(moduleDeps.map(function(module) {
        return Path.join('node_modules', module, '**/*');
    }));
    return gulp.src(src, {base: './'})
            .pipe(gulp.dest(destPath));
});

gulp.task('flatten-modules', function(cb) {
    var appLoc = process.platform === 'win32' ? 'dist/resources/app' : 'dist/Fireball.app/Contents/Resources/app';
    var flatten = require('flatten-packages');
    flatten(appLoc, {}, function (err, res) {
      if (err) console.error(err);
      if (res) return console.log(res);
    });
});

gulp.task('make-dist-mac', gulpSequence('rename-electron-mac', 'copy-app-dist', 'flatten-modules'));

gulp.task('make-dist-win', gulpSequence('rename-electron-win', 'copy-app-dist', 'flatten-modules'));
