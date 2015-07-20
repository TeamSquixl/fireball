var Path = require('fire-path');

var buildTask = require('./gulp-build');

var Builder = {

    /**
     * @param {string} platform - the id of target build platform
     * @param {string} destDir
     * @param {string[]} sceneList - array of scene uuid to build
     * @param {object} [options={}]
     * @param {function} [callback]
     */
    build: function (platform, destDir, sceneList, options, callback) {
        // Editor.sendToCore('app:build-project', 'web-mobile', '/Users/jareguo/Temp/Canvas Studio/mobile-Canvas Studio', [ '496ed832-b486-4427-8abe-d5b916de6022' ], { isDebug: true, projectName: 'Canvas Studio' });
        Editor.sendToWindows('builder:state-changed', 'start', 0);

        var scenes = sceneList.map(function (uuid) {
            var fsPath = Editor.assetdb.uuidToFspath(uuid);
            return {
                name: Path.basenameNoExt(fsPath),
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
                projectName: options.projectName,
                //projectType: Editor.projectType,
                runtimePath: Editor.runtimePath,
                dest: destDir,              // the path for the output files
                platform: platform,         // the target platform to build
                scenes: scenes,             // the list of scene\'s uuid to build
                resBundle: resBundle,       // the table of resource paths to uuid
                debug: options.isDebug,     // development build
                //resUuid: options.resUuid,
            };
            buildTask.startWithArgs(args, function (err) {
                if (err) {
                    Editor.error(err);
                    Editor.sendToWindows('builder:state-changed', 'error', 1, err);
                }
                else {
                    Editor.log('Built to "' + destDir + '" successfully');
                    Editor.sendToWindows('builder:state-changed', 'finish', 1);
                    //Editor.showItemInFolder(destDir);
                }
                if (callback) {
                    callback(err);
                }
            });
        //});
    }
};

module.exports = Builder;
