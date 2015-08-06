var mirror = JSON.parse(Fs.readFileSync('local-setting.json')).mirror;
var npmconf = require('npmconf');

function setupMirror(cb) {
    var hasMirrorSetting = false;
    var hasSettingFile = false;
    if ( Fs.existsSync('local-setting.json') ) {
        try {
            var jsonObj = JSON.parse(Fs.readFileSync('local-setting.json'));
            if (jsonObj.mirror) {
                return cb();
            } else {
                hasMirrorSetting = false;
                hasSettingFile = true;
            }
        }
        catch (err) {
            hasMirrorSetting = false;
            hasSettingFile = false;
        }
    } else {
        hasMirrorSetting = false;
        hasSettingFile = false;
    }

    if (hasMirrorSetting === false) {
        var readline = require('readline');
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question("Do you want to use mirror in China to download Electron and other dependencies? (y/n) : ", function(answer) {
            var obj;
            if (hasSettingFile) {
                obj = JSON.parse(Fs.readFileSync('local-setting.json'));
            } else {
                obj = {mirror: ''};
            }
            if (answer === 'y') {
                obj.mirror = 'china';
            } else {
                obj.mirror = 'global';
            }
            Fs.writeFileSync('local-setting.json', JSON.stringify(obj, null, '  '));
            rl.close();
            return cb();
        });
    } else {
        return cb();
    }
}

setupMirror(function() {
    npmconf.load(function(_, conf) {
        var registry = npmconf.defaults.registry;
        if (mirror === 'china') {
            registry = 'http://registry.npm.taobao.org/';
        }
        conf.set('registry', registry, 'user');
        conf.save('user', cb);
    });
});
