module.exports = {
    highlightHeaderLater: function (browserWindow) {
        browserWindow.once('devtools-opened', function () {
            //var dwc = win.devToolsWebContents;
            //dwc.once('dom-ready', function () {
            function changeHeaderColor () {
                var i = document.getElementById('inspector-app-iframe');
                var d = i.contentDocument;
                var s = d.querySelector('.inspector-view-tabbed-pane.tabbed-pane');
                var h = s.shadowRoot.querySelector('.tabbed-pane-header');
                h.style.cssText = "background-image: linear-gradient(rgb(150, 150, 150), rgb(238, 238, 238)) !important;";
            }
            setTimeout(function () {
                browserWindow.executeJavaScriptInDevTools('(' + changeHeaderColor + ')();');
            }, 200);
            //});
        });
    }
};
