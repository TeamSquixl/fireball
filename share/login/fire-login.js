Polymer({
    is: 'fire-login',

    properties: {
        userName: {
            type: String,
            value: ''
        },

        passWord: {
            type: String,
            value: ''
        },

        remember: {
            type: Boolean,
            value: true,
        }
    },

    verify: function () {
        this.$.username.invalid = false;
        this.$.pwd.invalid = false;
        if (!this.userName) {
            this.$.username.invalid = true;
            this.$.username.errorMessage = 'Please enter the account ';
            return false;
        }
        if (!this.passWord) {
            this.$.pwd.invalid = true;
            this.$.pwd.errorMessage = 'Please enter the password ';
            return false;
        }
        return true;
    },

    showAnimate: function (isShow) {
        if (isShow) {
            this.$.progress.style.display = 'block';
            this.$.mask.style.display = 'block';
        }
        else {
            this.$.progress.style.display = 'none';
            this.$.mask.style.display = 'none';
        }

    },

    _onSignClick: function (event) {
        event.stopPropagation();
        this.verify();
    },

    _forgetPwd: function () {
        event.stopPropagation();
        var shell = require('shell');
        shell.openExternal('http://fireball-x.com/user/forgotpassword');
        shell.beep();
    },
});
