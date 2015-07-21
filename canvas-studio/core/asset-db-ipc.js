var Ipc = require('ipc');

function _needCompile ( metaType ) {
    return metaType === 'javascript' ||
        metaType === 'coffeescript' ||
        metaType === 'typescript'
    ;
}

Ipc.on('asset-db:asset-changed', function ( result ) {
    // console.log(arguments);
    if ( _needCompile( result.type ) ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-moved', function ( results ) {
    var needRecompile = false;
    results.forEach( function ( result ) {
        var info = Editor.assetdb.assetInfo(result.uuid);
        var metaType = info['meta-type'];

        if ( !needRecompile ) {
            needRecompile = _needCompile(metaType);
        }

        if ( metaType === 'scene' ) {
            for ( var i = 0; i < Editor.sceneList.length; ++i ) {
                if ( result.uuid === Editor.sceneList[i].uuid ) {
                    Editor.sceneList[i].url = Editor.assetdb.uuidToUrl(result.uuid);
                    break;
                }
            }
        }
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-created', function ( results ) {
    var needRecompile = false;
    results.forEach( function ( result ) {
        var info = Editor.assetdb.assetInfo(result.uuid);
        var metaType = info['meta-type'];

        if ( !needRecompile ) {
            needRecompile = _needCompile(metaType);
        }

        if ( metaType === 'scene' ) {
            Editor.sceneList.push({
                url: result.url,
                uuid: result.uuid,
            });
        }
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-deleted', function ( results ) {
    var needRecompile = false;
    results.forEach( function ( result ) {
        var info = Editor.assetdb.assetInfoByPath(result.path);
        var metaType = info['meta-type'];

        if ( !needRecompile ) {
            needRecompile = _needCompile(metaType);
        }

        if ( metaType === 'scene' ) {
            for ( var i = 0; i < Editor.sceneList.length; ++i ) {
                if ( Editor.sceneList[i].uuid === result.uuid ) {
                    Editor.sceneList.splice( i, 1 );
                    break;
                }
            }
        }
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});
