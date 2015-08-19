var Emitter = require('events');
var Path = require('fire-path');

var buildTask = require('./gulp-build');
//var buildPreviewTask = require('./gulp-preview-build');

function _doBuild (options, callback) {
    // move default scene to first
    var sceneUuids = options.scenes;
    var startSceneIndex = sceneUuids.indexOf(options.startScene);
    if (startSceneIndex === -1) {
        Editor.error('Failed to find start scene in scene list.');
        return;
    }
    else if (startSceneIndex !== 0) {
        var toSwap = sceneUuids[0];
        sceneUuids[0] = sceneUuids[startSceneIndex];
        sceneUuids[startSceneIndex] = toSwap;
    }
    // create scene config
    var scenes = sceneUuids.map(function (uuid) {
        return {
            url: Editor.assetdb.uuidToUrl(uuid),
            uuid: uuid
        };
    });

    //Editor.sendToCore('asset-db:query-resources', function ( results ) {

    // query all simple assets
    Editor.assetdb.queryMetas('assets://**/*', '', function (err, results) {
        if (err) {
            return callback(err);
        }
        var Asset = Fire.Asset;
        var unImportedAssets = {};
        for (var i = 0, len = results.length; i < len; i++) {
            var meta = results[i];
            if (meta && meta.useRawfile()) {
                var type = meta.constructor['asset-type'];
                if (type === 'folder') {
                    continue;
                }
                var ctor = Editor.assets[type];
                var isRawAsset = ctor && !Fire.isChildClassOf(ctor, Asset);
                unImportedAssets[meta.uuid] = isRawAsset;
            }
        }
        results = null;

        // create resBundle
        var resBundle = {};
        //for ( var i = 0; i < results.length; ++i ) {
        //    var result = results[i];
        //    resBundle[result.path] = result.uuid;
        //}
        //
        var args = {
            project: Editor.projectPath, // the project to build
            projectName: options.title,
            //projectType: Editor.projectType,
            runtimePath: Editor.runtimePath,
            dest: options.buildPath,    // the path for the output files
            platform: options.platform, // the target platform to build
            scenes: scenes,             // the list of scene\'s uuid to build
            resBundle: resBundle,       // the table of resource paths to uuid
            unImportedAssets: unImportedAssets,
            debug: options.debug,       // development build
            //resUuid: options.resUuid,
        };
        (options.buildTask || buildTask).startWithArgs(Builder, args, callback);
    });
}

var Builder = Editor.JS.mixin(new Emitter(), {

    build: function (options, callback) {
        Editor.sendToWindows('builder:state-changed', 'start', 0);
        return _doBuild(options, function (err) {
            if (err) {
                Editor.error( 'Build Failed: %s', err.stack );
                Editor.sendToWindows('builder:state-changed', 'error', 1, err);
            }
            else {
                Editor.log('Built to "' + options.buildPath + '" successfully');
                Editor.sendToWindows('builder:state-changed', 'finish', 1);
                //Editor.showItemInFolder(options.buildPath);
            }
            if (callback) {
                callback(err);
            }
        });
    },

    buildForPreview: function (options, callback) {
        options = options || {};
        options.platform = 'web-preview';
        options.debug = true;
        //options.buildTask = buildPreviewTask;
        return _doBuild(options, function (err) {
            if (err) {
                Editor.error(err);
            }
            callback(err);
        });
    }
});

module.exports = Builder;
