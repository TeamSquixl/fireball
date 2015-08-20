document.addEventListener('DOMContentLoaded', function ( event ) {
    var socket = window.__socket_io__();
    socket.on('browser:reload', function () {
        window.location.reload();
    });

    function loadProjectSettings (callback) {
        Fire._JsonLoader('settings.json', function (error, json) {
            if (error) {
                Fire.error(error);
            }
            else {
                // retrieve minified raw assets
                var rawAssets = json.rawAssets;
                for (var uuid in rawAssets) {
                    var info = rawAssets[uuid];
                    if (typeof info === 'object') {
                        if (Array.isArray(info)) {
                            rawAssets[uuid] = { url: info[0], raw: false };
                        }
                    }
                    else {
                        rawAssets[uuid] = { url: info, raw: true };
                    }
                }
                //
                callback(json);
            }
        });
    }
    loadProjectSettings(function (settings) {
        // init engine
        var canvas = document.getElementById('GameCanvas');
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var option = {
            width: width,
            height: height,
            canvas: canvas,
            scenes: settings.scenes,
            //rawUrl: settings.rawUrl
        };
        Fire.engine.init(option, function () {
            // init assets
            Fire.AssetLibrary.init('resource/import', 'resource/raw', settings.rawAssets);

            // load stashed scene
            Fire._JsonLoader('stashed-scene.json', function (error, json) {
                var scene = Fire.deserialize(json);
                Fire.engine._initScene(scene, function () {
                    Fire.engine._launchScene(scene, function () {
                        // show canvas
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                        // play game
                        Fire.engine.play();
                    });
                });
            });
        });
    });
});
