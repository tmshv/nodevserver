var express = require("express");
var fs = require("fs");
var spbscrt = require("./spbscrt.js").spbscrt;

var FRESH = false;//true;
var DEFAULT_PORT = 8080;
var rootPublic = __dirname + '/www';

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(rootPublic));

app.post('/save', function (req, res) {
    var screen = req.body.screen;
    var doc = req.body.document;
    spbscrt.save(screen, doc, function (result) {
        res.send(result);
    });
});
app.get('/save/:screen/:doc', function (req, res) {
    var screen = req.param('screen', 'lol');
    var doc = req.param('doc', '123lll');
    spbscrt.save(screen, doc, function (result) {
        res.send(result);
    });
});
app.get('/get/:screen', function (req, res) {
    var screen = req.param('screen');
    spbscrt.get(screen, function (result) {
        res.send(result);
    });
});
app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = '/Users/tmshv/Dropbox/Secrets of Saint Petersburg/Workspace/assets' + reqpath;
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