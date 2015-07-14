Editor.stashedScene = null;
Editor.currentSceneUuid = null;

Editor.showDialogSaveScene = function () {
    var Path = require('fire-path');
    var Dialog = require('dialog');

    var saveUrl = Editor.assetdb.uuidToUrl(Editor.currentSceneUuid);
    if ( !saveUrl ) {
        var rootPath = Editor.assetdb._fspath('assets://');
        var savePath = Dialog.showSaveDialog( Editor.mainWindow.nativeWin, {
            title: 'Save Scene',
            defaultPath: rootPath,
            filters: [
                { name: 'Scenes', extensions: ['fire'] },
            ],
        } );

        if ( savePath ) {
            if ( Path.contains( rootPath, savePath ) ) {
                saveUrl = 'assets://' + Path.relative( rootPath, savePath );
            }
            else {
                Dialog.showMessageBox ( Editor.mainWindow.nativeWin, {
                    type: 'warning',
                    buttons: ['OK'],
                    title: 'Warning',
                    message: 'Warning: please save the scene in the assets folder.',
                    detail: 'The scene needs to be saved inside the assets folder of your project.',
                } );

                // try to popup the dailog for user to save the scene
                Editor.showDialogSaveScene();
            }
        }
    }

    if ( saveUrl ) {
        Editor.sendToPanel('scene.panel', 'scene:save-current', saveUrl);
    }
};
