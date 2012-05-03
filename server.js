var dropbox = require("./dropbox").dropbox;
var spbscrt = require("./spbscrt.js").spbscrt;

var FRESH = false;//true;

dropbox.establish(FRESH, function (success) {
    if (success) {
        console.log('connection to dropbox established');
        startListening();
//        dropbox.client.put('/Public/lol', "lol", function(status, reply){
//            console.log(reply);
//        });
//        dropbox.client.get('/spbscrt/Workspace/assets/scenes/test-scene-b.swf', function(status, reply){
//            console.log(reply.toString());
//        });
    } else {
        console.log('cannot connect to dropbox');
    }
});

var express = require('express');
//var hogan = require('hogan.js');

var DEFAULT_PORT = 8080;//1337;
var rootPublic = __dirname + '/www';
var rootTemplates = __dirname + '/templates';
var templateFiles = {
    login:'login.html',
    hello:'hello.html'
};

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
    var filepath = '/spbscrt/Workspace/assets' + reqpath;
    console.log('obtaining dropbox file ' + filepath);
    dropbox.client.get(filepath, function (status, reply) {
        res.send(reply);
    });
});

function startListening() {
    app.listen(DEFAULT_PORT);
    var addr = app.address();
    console.log("http://host:port".
        replace("host", addr.address).
        replace("port", addr.port)
    );
}
