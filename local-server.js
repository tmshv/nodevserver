var express = require("express");
var fs = require("fs");
var spbscrt = require("./spbscrt.js").spbscrt;

var FRESH = false;//true;
var DEFAULT_PORT = 7777;
var ROOT = "/Users/tmshv/Dropbox/SPBSCRT";
var GENERATED_PATH = ROOT + "/dyn";

var rootPublic = __dirname + '/www';

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

app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT + reqpath;
    console.log('obtaining file ' + filepath);
    fs.readFile(filepath, function (error, data) {
        if (error) {
            console.log('file not found');
            res.send('file not found', 404);
        } else {
            console.log('sending X bytes'.replace("X", data.length));
            res.contentType(filepath);
            res.send(data);
        }
    });
});

function startListening() {
    app.listen(DEFAULT_PORT);
    console.log("loc server started");
}
startListening();