var BrowserWindow = require('browser-window');
var Fs = require('fire-fs');

function _getDefaultMainMenu () {
    return [
        // Help
        {
           label: 'Help',
           id: 'help',
           submenu: [
           ]
        },

        // Fireball
        {
            label: 'Editor Framework',
            position: 'before=help',
            submenu: [
                { type: 'separator' },
                {
                    label: 'Hide',
                    accelerator: 'CmdOrCtrl+H',
                    selector: 'hide:'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'CmdOrCtrl+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                {
                    label: 'Show All',
                    selector: 'unhideAllApplications:'
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        Editor.Window.saveWindowStates();
                        Editor.quit();
                    }
                },
            ]
        },

        // File
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Project...',
                    click: function () {
                        Editor.App.runDashboard();
                    }
                },
                { type: 'separator' },
                {
                    label: 'New Scene',
                    accelerator: 'CmdOrCtrl+N',
                    click: function () {
                        Editor.log('TODO @jwu');
                        // TODO:
                        // Editor.sendToWindows('scene:new');
                    }
                },
                {
                    label: 'Save Scene',
                    accelerator: 'CmdOrCtrl+S',
                    click: function () {
                        Editor.log('TODO @jwu');
                        // TODO:
                        // Editor.sendToWindows('scene:save');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Build Settings',
                    accelerator: 'CmdOrCtrl+Shift+B',
                    click: function () {
                        // TODO:
                        Editor.log('TODO @jwu');
                    }
                },
                {
                    label: 'Build',
                    accelerator: 'CmdOrCtrl+B',
                    click: function () {
                        // TODO:
                        Editor.log('TODO @jwu');
                    }
                },
            ]
        },

        // Edit
        {
            label: 'Edit',
            submenu: [
                {
                   label: 'Undo',
                   accelerator: 'CmdOrCtrl+Z',
                   selector: 'undo:'
                },
                {
                   label: 'Redo',
                   accelerator: 'Shift+CmdOrCtrl+Z',
                   selector: 'redo:'
                },
                { type: 'separator' },
                {
                   label: 'Cut',
                   accelerator: 'CmdOrCtrl+X',
                   selector: 'cut:'
                },
                {
                   label: 'Copy',
                   accelerator: 'CmdOrCtrl+C',
                   selector: 'copy:'
                },
                {
                   label: 'Paste',
                   accelerator: 'CmdOrCtrl+V',
                   selector: 'paste:'
                },
                {
                   label: 'Select All',
                   accelerator: 'CmdOrCtrl+A',
                   selector: 'selectAll:'
                },
            ]
        },

        // Window
        {
            label: 'Window',
            id: 'window',
            submenu: Editor.isDarwin ?
            [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    selector: 'performMiniaturize:',
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    selector: 'performClose:',
                },
                { type: 'separator' },
                {
                    label: 'Bring All to Front',
                    selector: 'arrangeInFront:'
                },
            ] :
            [
                {
                    label: "Close",
                    accelerator: 'CmdOrCtrl+W',
                    click: function () {
                        Editor.Window.saveWindowStates();
                        Editor.quit();
                    },
                }
            ]
        },

        // Panel
        {
            label: 'Panel',
            id: 'panel',
            submenu: [
            ]
        },

        // Layout
        {
            label: 'Layout',
            id: 'layout',
            submenu: [
                {
                    label: 'Default',
                    click: function () {
                        var layoutInfo;
                        if ( Fs.existsSync(Editor._defaultLayout) ) {
                            try {
                                layoutInfo = JSON.parse(Fs.readFileSync(Editor._defaultLayout));
                            }
                            catch (err) {
                                Editor.error( 'Failed to load default layout: %s', err.message );
                                layoutInfo = null;
                            }
                        }
                        if ( layoutInfo) {
                            Editor.sendToMainWindow( 'editor:reset-layout', layoutInfo);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Empty',
                    click: function () {
                        Editor.sendToMainWindow( 'editor:reset-layout', null);
                    }
                },
            ]
        },

        // Developer
        {
            label: 'Developer',
            id: 'developer',
            submenu: [
                {
                    label: 'Command Palette',
                    accelerator: 'CmdOrCtrl+P',
                    click: function() {
                        Editor.mainWindow.focus();
                        Editor.sendToMainWindow('cmdp:show');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function() {
                        BrowserWindow.getFocusedWindow().reload();
                    }
                },
                {
                    label: 'Reload Ignoring Cache',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: function() {
                        BrowserWindow.getFocusedWindow().reloadIgnoringCache();
                    }
                },
                {
                    label: 'Reload Editor.App',
                    click: function() {
                        Editor.App.reload();
                    }
                },
                {
                    label: 'Compile',
                    accelerator: 'F7',
                    click: function() {
                        Editor.Compiler.compileAndReload();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Inspect Element',
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: function() {
                        var nativeWin = BrowserWindow.getFocusedWindow();
                        var editorWin = Editor.Window.find(nativeWin);
                        if ( editorWin ) {
                            editorWin.sendToPage( 'window:inspect' );
                        }
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+Alt+I',
                    click: function() { BrowserWindow.getFocusedWindow().openDevTools(); }
                },
                {
                    label: 'Debug Core',
                    type: 'checkbox',
                    checked: false,
                    click: function() {
                        Editor.Debugger.toggle();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Generate UUID',
                    click: function() {
                        var uuid = require('node-uuid');
                        Editor.log(uuid.v4());
                    }
                },
                {
                    label: 'Remove All Meta Files',
                    click: function() {
                        Editor.assetdb._rmMetas( function () {
                            Editor.success('Meta files removed');
                        });
                    }
                },
                { type: 'separator' },
                {
                    label: 'Run Tests (editor-framework)',
                    accelerator: 'CmdOrCtrl+Alt+T',
                    click: function() {
                        var testRunner = Editor.require('editor-framework://core/test-runner');
                        testRunner.liveRun( Editor.url('editor-framework://test/') );
                    }
                },
                {
                    label: 'Human Tests',
                    submenu: [
                        { type: 'separator' },
                        {
                            label: 'Throw an Uncaught Exception',
                            click: function() {
                                throw new Error('editor-framework Unknown Error');
                            }
                        },
                        {
                            label: 'send2panel \'foo:bar\' foobar.panel',
                            click: function() {
                                Editor.sendToPanel( "foobar.panel", "foo:bar" );
                            }
                        },
                    ],
                },
                { type: 'separator' },
            ]
        },
    ];
}

//
module.exports = _getDefaultMainMenu;
