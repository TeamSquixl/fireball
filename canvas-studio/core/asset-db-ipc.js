var Ipc = require('ipc');

function _needCompile ( metaType ) {
    return metaType === 'javascript' ||
        metaType === 'coffeescript' ||
        metaType === 'typescript'
    ;
}

Ipc.on('asset-db:asset-changed', function (type, uuid) {
    // console.log(arguments);
    if ( _needCompile(type) ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-moved', function ( results ) {
    var needRecompile = results.some(function ( result ) {
        var info = Editor.assetdb.assetInfo(result.uuid);
        return _needCompile(info['meta-type']);
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-created', function ( results ) {
    var needRecompile = results.some(function ( result ) {
        var info = Editor.assetdb.assetInfo(result.uuid);
        return _needCompile(info['meta-type']);
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});

Ipc.on('asset-db:assets-deleted', function ( results ) {
    var needRecompile = results.some(function ( result ) {
        var info = Editor.assetdb.assetInfoByPath(result.path);
        return _needCompile(info['meta-type']);
    });

    if ( needRecompile ) {
        Editor.Compiler.compileLater();
    }
});
