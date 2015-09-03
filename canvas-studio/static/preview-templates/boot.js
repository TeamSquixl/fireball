window.onload = function ( event ) {
    var isMobile = function () {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

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
        setCookie('rotate', rotated.toString());
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
        var idx = optsDevice.value;
        setCookie('device', idx.toString());
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

    // coockie
    // =======================
    function setCookie (name, value, days) {
        days = days || 30;              //cookie will be saved for 30 days
        var expires  = new Date();
        expires.setTime(expires.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + expires.toGMTString();
    }

    function getCookie (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if(arr != null) return (arr[2]);
        return null;
    }

    // init options
    function initOptions () {
        var defaultDevice = getCookie('device');
        var defaultRotate = getCookie('rotate');

        var hasDefaultDevice = defaultDevice != null;
        var hasDefaultRotate = defaultRotate != null;

        if (hasDefaultDevice) {
            optsDevice.value = parseInt(defaultDevice);
        }

        if (hasDefaultRotate && defaultRotate === 'true') {
            rotated = !rotated;
            if ( rotated ) {
                btnRotate.classList.add('checked');
            } else {
                btnRotate.classList.remove('checked');
            }
        }

        if (hasDefaultDevice || hasDefaultRotate) {
            updateResolution();
        }
    }

    // init engine
    // =======================

    var canvas = document.getElementById('GameCanvas');
    var width = _FireSettings.designWidth;
    var height = _FireSettings.designHeight;
    var engineInited = false;

    function resize () {
        var bcr = document.documentElement.getBoundingClientRect();

        var div = document.getElementById('GameDiv');
        div.style.width = bcr.width + 'px';
        div.style.height = bcr.height + 'px';

        // Fire.engine.canvasSize = new Fire.v2( bcr.width, bcr.height );
    }

    if ( isMobile() ) {
        window.addEventListener('resize', resize);

        var content = document.getElementById('content');
        var bcr = content.getBoundingClientRect();
        width = bcr.width;
        height = bcr.height;
    }

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
        initOptions();

        // init assets
        Fire.AssetLibrary.init('resource/import', 'resource/raw', _FireSettings.rawAssets);
        engineInited = true;

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
};
