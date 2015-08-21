Polymer({
    is: 'app-top-bar',

    properties: {
        previewURL: {
            value: '',
            type: String,
        },

        connectedCount: {
            value: 0,
            type: Number,
        },
    },

    ready: function () {
        this.previewURL = Editor.remote.IP + ':7456';
    },

    _onProject: function () {
        Editor.sendToCore('app:explore-project');
    },

});
