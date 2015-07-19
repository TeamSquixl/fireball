var Path = require('path');

var WAIT_MS = 100;
var RELOAD_WINDOW_SCRIPTS = 'scene:stash-and-reload';
//var COMPILE_AND_RELOAD = 'app:compile-and-reload';

var needRecompile = false;

var compilingWorker = null;
var firstError = null;
var debounceId;

function stopWorker () {
    if (compilingWorker) {
        compilingWorker.close();
    }
    else {
        Editor.error('None exists compiling worker');
    }
}

var Compiler = {

    compileScripts: function (callback) {
        Editor.sendToWindows('compiler:state-changed', 'compiling');

        var options = {
            project: Editor.projectPath,
            debug: true,
        };
        this.doCompile(options,
            function (error) {
                if (error) {
                    Editor.error(error);
                }
                if (callback) {
                    callback(!error);
                }
                Editor.sendToWindows('compiler:state-changed', error ? 'failed' : 'idle');
            }
        );
    },

    doCompile: function (options, callback) {
        if (compilingWorker) {
            return;
        }

        //options.globalPluginDir = Editor.dataPath;
        //options.pluginSettings = Editor.loadProfile('plugin', 'project');

        firstError = null;
        compilingWorker = Editor.App.spawnWorker('app://canvas-studio/page/compile-worker', function (browser) {
            browser.once('closed', function () {
                compilingWorker = null;
                if (callback) {
                    callback(firstError);
                }
            });

            browser.webContents.send('app:compile-worker-start', options);
        });
    },

    compileAndReload: function () {
        this.compileScripts(function (compiled) {
            Editor.sendToWindows(RELOAD_WINDOW_SCRIPTS, compiled);
        });
    },

    compileLater: function () {
        if (debounceId) {
            clearTimeout(debounceId);
        }
        debounceId = setTimeout(function () {
            Compiler.compileAndReload();
        }, WAIT_MS);
    },

    _onWorkerError: function (error) {
        firstError = firstError || error;
        stopWorker();
    },

    _onWorkerEnd: function () {
        Editor.log('Compiled successfully');
        stopWorker();
    }
};

module.exports = Compiler;
