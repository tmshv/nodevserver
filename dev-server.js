var express = require("express");
var fs = require("fs");

var FRESH = false;//true;
var DEFAULT_PORT = 8080;
var rootPublic = __dirname + '/www';
var ROOT_URL = "/Users/tmshv/Dropbox/Secrets of Saint Petersburg/Workspace/assets";

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(rootPublic));

app.post('/save', function (req, res) {
    var screen = req.body.screen;
    var path = ROOT_URL + '/' + req.body.screenURL;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(path, JSON.stringify(json, null, 4), function (err) {
        console.log("screen logic saved".replace("screen", screen));
        res.send("okay");
    });
});
app.post('/savescreensettings', function (req, res) {
    var screen = req.body.screen;
    var path = ROOT_URL + '/' + req.body.screenURL;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(path, JSON.stringify(json, null, 4), function (err) {
        console.log("screen settings saved".replace("screen", screen));
        res.send("okay");
    });
});
app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT_URL + reqpath;
    console.log('obtaining file ' + filepath);
    fs.readFile(filepath, function(error, data){
        if(error) {
            res.send('404');
        }else{
            res.send(data);
        }
    });
});

function startListening() {
    app.listen(DEFAULT_PORT);
    console.log("http://host:port".
        replace("host", "localhost").
        replace("port", DEFAULT_PORT)
    );
}
startListening();