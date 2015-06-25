// apply default main menu
var MainMenuTmplFn = require('./main-menu');
Editor.registerDefaultMainMenu(MainMenuTmplFn);
Editor.MainMenu.reset();

// init compiler
Editor.Compiler = require('./compiler');

// load scene utils
require('./scene-utils');
