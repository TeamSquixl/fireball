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

    var rotated = false;
    var paused = false;
    var btnRotate = document.getElementById('btn-rotate');
    var optsDevice = document.getElementById('opts-device');
    var btnPause = document.getElementById('btn-pause');


    function updateResolution () {
        var idx = optsDevice.value;
        var w, h;

        if ( idx === '0' ) {
            if ( !rotated ) {
                w = designWidth;
                h = designHeight;
            } else {
                w = designHeight;
                h = designWidth;
            }
        }
        else {
            var info = devices[idx];
            if ( !rotated ) {
                w = info.width;
                h = info.height;
            } else {
                w = info.height;
                h = info.width;
            }
        }

        var gameDiv = document.getElementById('GameDiv');
        gameDiv.style.width = w + 'px';
        gameDiv.style.height = h + 'px';

        Fire.engine.canvasSize = new Fire.v2( w, h );
    }

    // init rotate button
    btnRotate.addEventListener('click', function () {
        rotated = !rotated;
        if ( rotated ) {
            btnRotate.classList.add('checked');
        } else {
            btnRotate.classList.remove('checked');
        }
        updateResolution();
    });

    // init device resolutions
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

    devices.forEach( function ( info, idx ) {
        var opt = document.createElement('option');
        opt.value = idx+1;
        opt.text = info.name;
        optsDevice.add( opt, null );
    });

    optsDevice.addEventListener( 'change', function ( event ) {
        updateResolution();
    });

    // init pause button
    btnPause.addEventListener('click', function () {
        if ( Fire.engine.isPaused ) {
            Fire.engine.play();
            btnPause.classList.remove('checked');
        } else {
            Fire.engine.pause();
            btnPause.classList.add('checked');
        }
    });

    // init engine
    // =======================

    function resize () {
        // var content = document.getElementById('content');
        // var bcr = content.getBoundingClientRect();
        // Fire.engine.canvasSize = new Fire.v2( bcr.width, bcr.height );
    }
    window.addEventListener('load', resize);
    window.addEventListener('resize', resize);

    var canvas = document.getElementById('GameCanvas');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    var option = {
        width: _FireSettings.designWidth,
        height: _FireSettings.designHeight,
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
