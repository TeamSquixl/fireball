Polymer({
    is: 'app-top-bar',

    _onProject: function () {
        Editor.sendToCore('app:explore-project');
    },

    _onAssets: function () {
        Editor.sendToCore('app:explore-assets');
    },

    _onLibrary: function () {
        Editor.sendToCore('app:explore-library');
    },
});
