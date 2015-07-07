Polymer({
    is: 'app-top-bar',

    _onProject: function () {
        Editor.sendToCore('app:explore-project');
    },
});
