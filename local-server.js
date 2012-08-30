var express = require("express");
var fs = require("fs");
var spbscrt = require("./spbscrt.js").spbscrt;

var FRESH = false;//true;
var DEFAULT_PORT = 7777;
var ROOT = "/Users/tmshv/Dropbox/SPBSCRT";
var GENERATED_PATH = ROOT + "/dyn";

var rootPublic = __dirname + '/../bin';//www';
rootPublic = "/Users/tmshv/Dropbox/Dev/Spbscrts/bin";

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(rootPublic));

app.post('/saveLogic', function (req, res) {
    var screen = req.body.screen;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(GENERATED_PATH + "/" + screen + "_logic.json", JSON.stringify(json, null, 4), function (err) {
        console.log("screen logic saved".replace("screen", screen));
        res.send("save logic okay");
    });
});
app.post('/saveParams', function (req, res) {
    var screen = req.body.screen;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(GENERATED_PATH + "/" + screen + "_params.json", JSON.stringify(json, null, 4), function (err) {
        console.log("screen params saved".replace("screen", screen));
        res.send("save params okay");
    });
});
app.post('/saveProgress', function (req, res) {
    var login = req.body.login;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    fs.writeFile(ROOT + "/progress/" + login + ".json", JSON.stringify(json, null, 4), function (err) {
        if(err){
            console.log(err);
            res.send("", 400);
        }
        console.log("%s progress saved", login);
        res.send("save progress okay");
    });
});

app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT + reqpath;
    fs.readFile(filepath, function (error, data) {
        if (error) {
            console.error("%s: file not found (404)", reqpath);
            res.send('file not found', 404);
        } else {
            console.log("%s: sending %d kb", reqpath, Math.round(data.length/1024 * 100) / 100);
            res.contentType(filepath);
            res.send(data);
        }
    });
});

app.listen(DEFAULT_PORT);
console.log("local server started");
console.log("root public (static server): %s", rootPublic);