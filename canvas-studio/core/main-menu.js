var BrowserWindow = require('browser-window');
var Fs = require('fire-fs');
var Shell = require('shell');
var DevTools = require('./dev-tools');

function _getDefaultMainMenu () {
    return [
        // Help
        {
           label: 'Help',
           id: 'help',
           submenu: [
               {
                   label: 'Documentation',
                   click: function () {
                       Shell.openExternal('http://docs.fireball-x.com/');
                       Shell.beep();
                   }
               },
               {
                   label: 'Discussion Group',
                   click: function () {
                       Shell.openExternal('http://fireball-x.com/chat');
                       Shell.beep();
                   }
               },
               { type: 'separator' },
               {
                   label: 'Report Issue',
                   click: function () {
                       Shell.openExternal('https://github.com/fireball-x/fireball/issues/');
                       Shell.beep();
                   }
               },
               {
                   label: 'Subscribe',
                   click: function () {
                       Shell.openExternal('http://eepurl.com/bh5w3z');
                       Shell.beep();
                   }
               },
               { type: 'separator' },
               {
                   label: 'About Fireball',
                   click: function () {
                        var aboutWindow = new Editor.Window('about', {
                            'title': 'About Fireball',
                            'width': 400,
                            'height': 180,
                            'always-on-top': true,
                            'show': false,
                            'resizable': false,
                        });

                        mainWindow = Editor.mainWindow;
                        var postion_ = mainWindow.nativeWin.getPosition();
                        var size_ = mainWindow.nativeWin.getSize();
                        aboutWindow.load( 'app://canvas-studio/page/app-about.html' );
                        var x = (postion_[0] + size_[0]/2 - 200);
                        var y = (postion_[1] + size_[1]/2 - 90);
                        aboutWindow.nativeWin.setPosition(Math.floor(x),Math.floor(y));
                        aboutWindow.show();
                        aboutWindow.nativeWin.on('blur',function () {
                            aboutWindow.close();
                        });
                   }
               },
           ]
        },

        // Fireball
        {
            label: 'Editor Framework',
            position: 'before=help',
            submenu: [
                {
                    label: 'About Fireball',
                    click: function () {
                        Editor.info('Fireball v0.5 alpha4 20150807');
                    }
                },
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
                        Editor.sendToPanel('scene.panel', 'scene:new-scene');
                    }
                },
                {
                    label: 'Save Scene',
                    accelerator: 'CmdOrCtrl+S',
                    click: function () {
                        Editor.showDialogSaveScene();
                    }
                },
                { type: 'separator' },
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
                { type: 'separator' },
                {
                   label: 'Play',
                   accelerator: 'CmdOrCtrl+P',
                   click: function () {
                       Editor.sendToMainWindow('editor:toggle-play');
                   },
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
                            } catch (err) {
                                Editor.error( 'Failed to load default layout: %s', err.message );
                                layoutInfo = null;
                            }
                        }
                        if ( layoutInfo) {
                            Editor.sendToMainWindow( 'editor:reset-layout', layoutInfo);
                        }
                    }
                },
                {
                    label: 'Assets',
                    click: function () {
                        var path = Editor.url('app://canvas-studio/static/layout/assetdb.json');
                        var layoutInfo;
                        if ( Fs.existsSync(path) ) {
                            try {
                                layoutInfo = JSON.parse(Fs.readFileSync(path));
                            } catch (err) {
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
                    accelerator: 'CmdOrCtrl+:',
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
                        Editor.stashedScene = null;
                        BrowserWindow.getFocusedWindow().reload();
                    }
                },
                {
                    label: 'Reload Ignoring Cache',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: function() {
                        Editor.stashedScene = null;
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
                    click: function() {
                        var win = BrowserWindow.getFocusedWindow();
                        win.openDevTools();
                        DevTools.highlightHeaderLater(win);
                    }
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
                {
                    label: 'UI Preview',
                    submenu: [
                    ],
                },
                { type: 'separator' },
            ]
        },
    ];
}

//
module.exports = _getDefaultMainMenu;
