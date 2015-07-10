/**
 * Tasks downloading electron
 * Created by nantas on 15/2/28.
 */

var gulp = require('gulp');
var shell = require('gulp-shell');
var gulpSequence = require('gulp-sequence');

var Path = require('path');
var Fs = require('fs');

var pjson = JSON.parse(Fs.readFileSync('./package.json'));
var electronVer = pjson['electron-version'];
var spawn = require('child_process').spawn;

/////////////////////////////////////////////////////
// inits
/////////////////////////////////////////////////////

if ( electronVer === null || electronVer === undefined ) {
    console.error( 'Can not read electron-version from package.json' );
    return;
}

/////////////////////////////////////////////////////
// downloads
/////////////////////////////////////////////////////

function checkElectronInstalled () {
    var binary = process.platform === 'win32' ? 'electron.exe' : 'Electron.app';
    if (Fs.existsSync(Path.join('bin', 'electron', binary)) &&
        Fs.existsSync(Path.join('bin', 'electron', 'version')) ) {
        var version = Fs.readFileSync(Path.join('bin', 'electron', 'version'), 'utf8');
        if (version === 'v' + electronVer) {
            console.log('Electron version ' + version + ' already installed in bin/electron.');
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

gulp.task('update-electron', function(cb) {
    if ( checkElectronInstalled() ) {
        cb();
    } else {
        gulpSequence('setup-mirror', 'install-electron','electron-to-bin', cb);
    }
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


function installElectron (isChina, cb) {
    var cmdstr = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    var tmpenv = process.env;
    if(isChina) {
        tmpenv.ELECTRON_MIRROR = 'http://npm.taobao.org/mirrors/electron/';
    }
    var child = spawn(cmdstr, ['install', '-g', 'electron-prebuilt'+ '@' + electronVer], {
        stdio: 'inherit',
        env: tmpenv
    });
    child.on('exit', function() {
        cb();
    });
}

gulp.task('install-electron', function(cb) {
    var mirror = JSON.parse(Fs.readFileSync('mirror-setting.json')).mirror;
    var isChina = mirror === 'china' ? true : false;
    installElectron(isChina, cb);
});

gulp.task('electron-to-bin', function(cb) {
    var ncp = require('ncp');
    var prefix = require('global-prefix');
    var libMod = process.platform === 'win32' ? '' : 'lib';
    var electronPath = Path.join(prefix, libMod, 'node_modules', 'electron-prebuilt', 'dist');
    console.log("copying electron from: " + electronPath);
    var mkdirp = require('mkdirp');
    mkdirp.sync('bin/electron');
    ncp(electronPath, 'bin/electron', {clobber: true}, function(err){
        if (err) return console.log('ncp Error: ' + err);
        else {
            console.log('Electron ' + Fs.readFileSync(Path.join(electronPath, 'version')) + ' has been download to bin/electron folder');
            cb();
        }
    });
});

gulp.task('setup-mirror', function(cb) {
    var needBuildSetting = false;
    if ( Fs.existsSync('mirror-setting.json') ) {
        try {
            var jsonObj = JSON.parse(Fs.readFileSync('mirror-setting.json'));
            if (jsonObj.mirror) {
                return cb();
            }
        }
        catch (err) {
            needBuildSetting = true;
        }
    } else {
        needBuildSetting = true;
    }

    if (needBuildSetting) {
        var readline = require('readline');
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question("Do you want to use mirror in China to download Electron and other dependencies? (y/n) : ", function(answer) {
            var obj = {mirror: ''};
          if (answer === 'y') {
              obj.mirror = 'china';
          } else {
              obj.mirror = 'global';
          }
          Fs.writeFileSync('mirror-setting.json', JSON.stringify(obj));
          rl.close();
          return cb();
        });
    } else {
        return cb();
    }
});
