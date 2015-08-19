
var isNative = typeof document !== 'undefined';

function load() {

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


        var canvas,
            width = 640,
            height = 480;

        if (isNative) {
            canvas = document.getElementById('GameCanvas');
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        }

        var option = {
            width: width,
            height: height,
            canvas: canvas,
            scenes: settings.scenes,
            //rawUrl: settings.rawUrl
        };
        Fire.engine.init(option, function () {
            //// makes the container's size equals to the frame's size
            //Fire.Screen.ContainerStrategy.EqualToFrame.apply();

            // init assets
            Fire.AssetLibrary.init('resource/import', 'resource/raw', settings.rawAssets);

            // load scene
            Fire.engine.loadScene(settings.launchScene, null,
                function () {
                    if (isNative) {
                        // show canvas
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                    }
                    // play game
                    Fire.engine.play();
                }
            );
        });
    });
};

if (isNative) {
    window.onload = load;
}
else {
    load();
}
