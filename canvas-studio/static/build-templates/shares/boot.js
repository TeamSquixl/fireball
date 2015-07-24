;window.onload = function () {

    function loadProjectSettings (callback) {
        Fire._JsonLoader('settings.json', function (error, json) {
            if (error) {
                Fire.error(error);
            }
            else {
                callback(json);
            }
        });
    }
    loadProjectSettings(function (settings) {
        // init engine
        var canvas = document.getElementById('GameCanvas');
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        Fire.engine.init({
            width: width,
            height: height,
            canvas: canvas,
            scenes: settings.scenes,
            rawUrl: settings.rawUrl
        },
        function () {
            //// makes the container's size equals to the frame's size
            //Fire.Screen.ContainerStrategy.EqualToFrame.apply();

            // init assets
            //var urlSuffix = settings.resUuid ? '/' + settings.resUuid : '';
            //Fire.AssetLibrary.init('resource' + urlSuffix + '/library');
            Fire.AssetLibrary.init('resource');

            // load scene
            Fire.engine.loadScene(settings.launchScene, null,
                function () {
                    // show canvas
                    canvas.style.visibility = '';
                    var div = document.getElementById('GameDiv');
                    if (div) {
                        div.style.backgroundImage = '';
                    }
                    // play game
                    Fire.engine.play();
                }
            );
        });

    });
};
