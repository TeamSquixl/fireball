document.addEventListener('DOMContentLoaded', function ( event ) {
    var socket = window.__socket_io__();
    socket.on('browser:reload', function () {
        window.location.reload();
    });
    socket.on('browser:confirm-reload', function () {
        var r = confirm( 'Reload?' );
        if ( r ) {
            window.location.reload();
        }
    });

    function resize () {
        var div = document.getElementById('GameDiv');
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        div.style.width = width + "px";
        div.style.height = height + "px";
    }
    window.addEventListener('load', resize);
    window.addEventListener('resize', resize);

    // init engine
    var canvas = document.getElementById('GameCanvas');
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var option = {
        width: width,
        height: height,
        canvas: canvas,
        scenes: _FireSettings.scenes,
        //rawUrl: _FireSettings.rawUrl
    };
    Fire.engine.init(option, function () {
        // init assets
        Fire.AssetLibrary.init('resource/import', 'resource/raw', _FireSettings.rawAssets);

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

                    Fire.engine.designResolution = Fire.v2(_FireSettings.designWidth, _FireSettings.designHeight);

                    // play game
                    Fire.engine.play();

                    // purge
                    _FireSettings = undefined;
                });
            });
        });
    });
});
