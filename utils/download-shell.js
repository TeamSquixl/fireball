/**
 * Tasks downloading fire-shell and native modules
 * Created by nantas on 15/2/28.
 */

var gulp = require('gulp');
var updateFireShell = require('gulp-download-fire-shell');
var shell = require('gulp-shell');

var Path = require('path');
var Fs = require('fs');

var pjson = JSON.parse(Fs.readFileSync('./package.json'));
var fireshellVer = pjson['fire-shell-version'];
var electronVer = pjson['electron-version'];

/////////////////////////////////////////////////////
// inits
/////////////////////////////////////////////////////

if ( fireshellVer === null || fireshellVer === undefined ) {
    console.error( 'Can not read fire-shell-version from package.json' );
    return;
}

if ( electronVer === null || electronVer === undefined ) {
    console.error( 'Can not read electron-version from package.json' );
    return;
}

/////////////////////////////////////////////////////
// downloads
/////////////////////////////////////////////////////

gulp.task('update-electron', function(cb) {
    updateFireShell.downloadAtomShell({
        version: electronVer,
        outputDir: 'bin/electron'
    }, cb);
});

gulp.task('update-fire-shell', function(cb) {
    updateFireShell.downloadFireShell({
        version: fireshellVer,
        outputDir: 'bin/fire-shell'
    }, cb);
});

gulp.task('update-fire-shell-china', function(cb) {
    updateFireShell.downloadFireShell({
        version: fireshellVer,
        outputDir: 'bin/fire-shell',
        chinaMirror: true
    }, cb);
});

gulp.task('prebuild-native-module', shell.task(['node config.js true']));

gulp.task('update-atom-native-module', ['prebuild-native-module'], function(cb) {
    var setcmd = process.platform === 'win32' ? 'set' : 'export';
    var stream = shell([
        'apm install'
    ], {
        cwd: 'bin',
        env: {
            ATOM_NODE_VERSION: electronVer
        }
    });
    stream.write(process.stdout);
    stream.end();
    stream.on('finish', cb);
});

gulp.task('update-fire-native-module', function(cb) {
    var nativeModules = require('../../src/main/package.json')['native-modules'];
    updateFireShell.downloadNativeModules({
        version: fireshellVer,
        outputDir: Path.join('bin','node_modules'),
        nativeModules: nativeModules,
        isFireShell: true
    }, cb);
});

gulp.task('update-fire-native-module-china', function(cb) {
    var nativeModules = require('../../src/main/package.json')['native-modules'];
    updateFireShell.downloadNativeModules({
        version: fireshellVer,
        outputDir: Path.join('bin','node_modules'),
        nativeModules: nativeModules,
        isFireShell: true,
        chinaMirror: true
    }, cb);
});

gulp.task('clear-cached-downloads', function(cb) {
    updateFireShell.clearCachedDownloads({
        versionAtom: electronVer,
        versionFire: fireshellVer
    }, cb);
});

gulp.task('copy-fire-shell', ['del-dist'], function(cb) {
    updateFireShell.downloadFireShell({
        version: fireshellVer,
        outputDir: 'dist/',
        chinaMirror: true
    }, cb);
});

gulp.task('copy-electron-mac', function(cb) {
    var ncp = require('ncp');
    ncp('bin/electron/Electron.app', 'dist/Fireball.app', function(err) {
        if (err) return console.log('ncp Error: ' + err);
        else {
            ncp('utils/res/atom.icns', 'dist/Fireball.app/Contents/Resources/atom.icns', {clobber: true}, function(err) {
                cb();
            });
        }
    });
});

gulp.task('copy-electron-win', function(cb) {
    var ncp = require('ncp');
    ncp('bin/electron', 'dist', function(err){
        if (err) return console.log('ncp Error: ' + err);
        else {
            var spawnSync = require('child_process').spawnSync;
            spawnSync('mv', ['dist/electron.exe', 'dist/fireball.exe']);
            cb();
        }
    });
});

gulp.task('rename-electron-win', ['copy-electron-win'], function(cb) {
   var rcedit = require('rcedit');
   rcedit('dist/fireball.exe', {
       "product-version": pjson.version,
       "icon": "utils/res/atom.ico"
   }, function(err) {
       if (err) console.log(err);
       else cb();
   });
});

gulp.task('rename-electron-mac', ['copy-electron-mac'], function (cb) {
    var plist = require('plist');
    var spawnSync = require('child_process').spawnSync;
    var plistSrc = ['dist/Fireball.app/Contents/Info.plist', 'dist/Fireball.app/Contents/Frameworks/Electron Helper.app/Contents/Info.plist'];
    plistSrc.forEach(function(file) {
        var obj = plist.parse(Fs.readFileSync(file, 'utf8'));
        obj.CFBundleDisplayName = 'Fireball';
        obj.CFBundleIdentifier = 'com.fireball-x.www';
        obj.CFBundleName = 'Fireball';
        obj.CFBundleExecutable = 'Fireball';
        Fs.writeFileSync(file, plist.build(obj), 'utf8');
    });

    var renameSrc = [
        'dist/Fireball.app/Contents/MacOS/Electron',
        'dist/Fireball.app/Contents/Frameworks/Electron Helper EH.app',
        'dist/Fireball.app/Contents/Frameworks/Electron Helper NP.app',
        'dist/Fireball.app/Contents/Frameworks/Electron Helper.app',
        'dist/Fireball.app/Contents/Frameworks/Fireball Helper EH.app/Contents/MacOS/Electron Helper EH',
        'dist/Fireball.app/Contents/Frameworks/Fireball Helper.app/Contents/MacOS/Electron Helper',
        'dist/Fireball.app/Contents/Frameworks/Fireball Helper NP.app/Contents/MacOS/Electron Helper NP'
    ];

    renameSrc.forEach(function(file) {
        spawnSync('mv', [file, file.replace(/Electron/, 'Fireball')]);
    });

    cb();
});
