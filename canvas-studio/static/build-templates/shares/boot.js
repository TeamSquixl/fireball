(function () {

    function boot () {

        // retrieve minified raw assets
        var rawAssets = _FireSettings.rawAssets;
        for (var uuid in rawAssets) {
            var info = rawAssets[uuid];
            if (typeof info === 'object') {
                if (Array.isArray(info)) {
                    rawAssets[uuid] = {url: info[0], raw: false};
                }
            }
            else {
                rawAssets[uuid] = {url: info, raw: true};
            }
        }

        // init engine
        var canvas,
            width = 640,
            height = 480;

        if (Fire.isWeb) {
            canvas = document.getElementById('GameCanvas');
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        }

        var option = {
            width: width,
            height: height,
            canvas: canvas,
            scenes: _FireSettings.scenes,
            //rawUrl: _FireSettings.rawUrl
        };
        Fire.engine.init(option, function () {
            //// makes the container's size equals to the frame's size
            //Fire.Screen.ContainerStrategy.EqualToFrame.apply();

            // init assets
            Fire.AssetLibrary.init('resource/import', 'resource/raw', _FireSettings.rawAssets);

            // load scene
            Fire.engine.loadScene(_FireSettings.launchScene, null,
                function () {
                    if (Fire.isWeb) {
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

            // purge
            _FireSettings = undefined;
        });
    }

    if (Fire.isWeb) {
        window.onload = boot;
    }
    else {
        boot();
    }
})();
