var spbscrt = require('./spbscrt.js').spbscrt;
var fileserver = require('./fileserver.js').fileserver;
var dropbox = require('./dropbox.js').dropbox;
var fs = require('fs');

fs.readFile('lastpid', 'utf-8', function (err, data) {
    if (err) {
        start();
    } else {
        var last_pid = parseInt(data);
        if (last_pid) {
            console.log('last pid ', last_pid);
            try {
                process.kill(last_pid, 'SIGHUP');
                console.log('killed');
            } catch (error) {

            }
        }
        start();
    }
});

function start() {
    fs.writeFile('lastpid', process.pid.toString(), function (err) {
        console.log('pid ', process.pid);
    });
    launch();
}

function launch() {
    dropbox.establish(function () {
        spbscrt.start();
        fileserver.start({
            exist:function (uri, callback) {
                console.log('establishing existence of file ' + uri);
                dropbox.getFile(uri, callback);
            }
        });
    });
}