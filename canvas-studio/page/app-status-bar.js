var Remote = require('remote');
var App = Remote.require('app');

Polymer({
    is: 'app-status-bar',

    ready: function () {
        var appVer = App.getVersion();
        this.version = 'Fireball v' + appVer;
    },
});
