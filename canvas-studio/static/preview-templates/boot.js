document.addEventListener('DOMContentLoaded', function ( event ) {
    // socket
    // =======================

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

    // init toolbar
    // =======================

    var designWidth = _FireSettings.designWidth;
    var designHeight = _FireSettings.designHeight;

    var devices = [
        { name: 'Apple iPad', width: 1024, height: 768, ratio: 2 },
        { name: 'Apple iPad Mini', width: 1024, height: 768, ratio: 1 },
        { name: 'Apple iPhone 4', width: 320, height: 480, ratio: 2 },
        { name: 'Apple iPhone 5', width: 320, height: 568, ratio: 2 },
        { name: 'Apple iPhone 6', width: 375, height: 667, ratio: 2 },
        { name: 'Apple iPhone 6 Plus', width: 414, height: 736, ratio: 3 },
        { name: 'Goolge Nexus 4', width: 384, height: 640, ratio: 2 },
        { name: 'Goolge Nexus 5', width: 360, height: 640, ratio: 3 },
        { name: 'Goolge Nexus 6', width: 412, height: 732, ratio: 3.5 },
        { name: 'Goolge Nexus 7', width: 960, height: 600, ratio: 2 },
    ];

    var optsDevice = document.getElementById('opts-device');
    devices.forEach( function ( info, idx ) {
        var opt = document.createElement('option');
        opt.value = idx+1;
        opt.text = info.name;
        optsDevice.add( opt, null );
    });

    optsDevice.addEventListener( 'change', function ( event ) {
        var gameDiv = document.getElementById('GameDiv');

        // event.target.value;
        var idx = event.target.value;
        if ( idx === 0 ) {
            gameDiv.style.width = designWidth + 'px';
            gameDiv.style.height = designHeight + 'px';
            return;
        }

        var info = devices[idx];
        gameDiv.style.width = info.width + 'px';
        gameDiv.style.height = info.height + 'px';
    });

    var paused = false;
    var btnPause = document.getElementById('btn-pause');
    btnPause.addEventListener('click', function () {
        if ( Fire.engine.isPaused ) {
            Fire.engine.play();
            btnPause.classList.remove('paused');
        } else {
            Fire.engine.pause();
            btnPause.classList.add('paused');
        }
    });

    // init engine
    // =======================

    function resize () {
        // var div = document.getElementById('GameDiv');
        // var width = document.documentElement.clientWidth;
        // var height = document.documentElement.clientHeight;
        // div.style.width = width + 'px';
        // div.style.height = height + 'px';
    }
    window.addEventListener('load', resize);
    window.addEventListener('resize', resize);

    var canvas = document.getElementById('GameCanvas');
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var option = {
        width: width,
        height: height,
        canvas: canvas,
        designWidth: _FireSettings.designWidth,
        designHeight: _FireSettings.designHeight,
        scenes: _FireSettings.scenes,
        // rawUrl: _FireSettings.rawUrl
    };

    Fire.engine.init(option, function () {
        // init assets
        Fire.AssetLibrary.init('resource/import', 'resource/raw', _FireSettings.rawAssets);

        // load stashed scene
        Fire._JsonLoader('stashed-scene.json', function (error, json) {
            var scene = Fire.deserialize(json);
            Fire.engine._initScene(scene, function () {
                Fire.engine._launchScene(scene, function () {
                    var splash = document.getElementById('splash');
                    splash.style.display = 'none';

                    // show canvas
                    canvas.style.visibility = '';
                    var div = document.getElementById('GameDiv');
                    if (div) {
                        div.style.backgroundImage = '';
                    }

                    // play game
                    Fire.engine.play();

                    // purge
                    _FireSettings = undefined;
                });
            });
        });
    });
});
