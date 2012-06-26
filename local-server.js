var express = require("express");
var fs = require("fs");
var spbscrt = require("./spbscrt.js").spbscrt;

var FRESH = false;//true;
var DEFAULT_PORT = 7777;
//var ROOT_URL = "/Users/tmshv/Dropbox/Dev/spbscrt-local-server";
var ROOT_URL = "/Users/tmshv/Dropbox/Secrets of Saint Petersburg/Workspace/assets";

var rootPublic = __dirname + '/www';

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(rootPublic));

app.post('/save', function (req, res) {
    var screen = req.body.screen;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(ROOT_URL + "/logic/" + screen + ".json", JSON.stringify(json, null, 4), function (err) {
        console.log("screen logic saved".replace("screen", screen));
        res.send("okay");
    });
});
app.post('/savescreensettings', function (req, res) {
    var screen = req.body.screen;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(ROOT_URL + "/screens/" + screen + ".json", JSON.stringify(json, null, 4), function (err) {
        console.log("screen settings saved".replace("screen", screen));
        res.send("okay");
    });
});

app.get('/get/:screen', function (req, res) {
    var screen = req.param('screen');
    try {
        var out = fs.readFileSync(ROOT_URL + "/logic/" + screen + ".json").toString();
        res.send(out);
    } catch (error) {
        console.log(error);
        res.send("lol");
    }
});

app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT_URL + reqpath;
//    var filepath = '/Users/tmshv/Dropbox/Secrets of Saint Petersburg/Workspace/assets' + reqpath;
    console.log('obtaining file ' + filepath);
    fs.readFile(filepath, function (error, data) {
        if (error) {
            res.send('404');
        } else {
            res.send(data);
        }
    });
});

function startListening() {
    app.listen(DEFAULT_PORT);
    console.log("loc server started");
}
startListening();