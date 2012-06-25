var dbox = require('dbox');
var fs = require('fs');

var drbox = dbox.app({
    'root': "dropbox",
    'app_key': 'hsekg8dhwh9qo2o', //'7bwdoaznafgbygh',
    'app_secret':'enstw52f9k45ha5' //'n36hf7775oj9i46'
});


function readAccessToken(callback) {
    fs.readFile('token', function (error, data) {
        if (error) callback(null);
        else callback(JSON.parse(data));
    });
}

function saveAccessToken(token) {
    fs.writeFileSync('token', JSON.stringify(token));
}

function obtainAccess(callback) {
    drbox.request_token(function (status, request_token) {
        var url = request_token.authorize_url;
        console.log('auth url: ' + url);

        var access_token_interval = setInterval(function () {
            drbox.access_token(request_token, function (status, access_token) {
                console.log(status);
                console.log(access_token);
                if (status == 200) {
                    clearInterval(access_token_interval);
                    saveAccessToken(access_token);
                    console.log('auth okay!');
                    dropbox.init(access_token);
                    callback(access_token);
                }
            });
        }, 2500);
    });
}

var dropbox = {
    DROPBOX_ACCESS_TOKEN:null,
    client:null,

    init:function (accessToken) {
        this.DROPBOX_ACCESS_TOKEN = accessToken;
        this.client = drbox.createClient(accessToken);
    },

    establish:function (fresh, callback) {
        if (fresh) {
            obtainAccess(function (access_token) {
                if (access_token) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            readAccessToken(function (token) {
                if (token) {
                    dropbox.init(token);
                    callback(true);
                } else {
                    this.establish(true, callback);
                }
            });
        }
    }
}
exports.dropbox = dropbox;