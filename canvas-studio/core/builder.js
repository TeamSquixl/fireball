var Emitter = require('events');
var Path = require('fire-path');

var buildTask = require('./gulp-build');
var Builder = Editor.JS.mixin(new Emitter(), {

    /**
     * @param {object} [options={}]
     * @param {function} [callback]
     */
    build: function (options, callback) {
        // Editor.sendToCore('app:build-project', 'web-mobile', '/Users/jareguo/Temp/Canvas Studio/mobile-Canvas Studio', [ '496ed832-b486-4427-8abe-d5b916de6022' ], { isDebug: true, projectName: 'Canvas Studio' });
        Editor.sendToWindows('builder:state-changed', 'start', 0);

        var scenes = options.scenes.map(function (uuid) {
            return {
                url: Editor.assetdb.uuidToUrl(uuid),
                uuid: uuid
            };
        });

        //Editor.sendToCore('asset-db:query-resources', function ( results ) {
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
                debug: options.debug,       // development build
                //resUuid: options.resUuid,
            };
            buildTask.startWithArgs(Builder, args, function (err) {
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
        //});
    }
});

module.exports = Builder;
