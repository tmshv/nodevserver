var dropbox = require("./dropbox").dropbox;

var FRESH = false;//true;
var DEFAULT_PORT = 1337;
var rootPublic = __dirname + '/www';
var rootTemplates = __dirname + '/templates';
var ROOT_URL = "/spbscrt/Workspace/assets";

dropbox.establish(FRESH, function (success) {
    if (success) {
        console.log('connection to dropbox established');
        startListening();
    } else {
        console.log('cannot connect to dropbox');
    }
});

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(rootPublic));

app.post('/save', function (req, res) {
    var screen = req.body.screen;
    var path = ROOT_URL + '/' + req.body.screenURL;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    dropbox.client.put(path, JSON.stringify(json, null, 4), function (status, reply) {
        console.log(reply);
        console.log("screen logic saved".replace("screen", screen));
        res.send("okay");
    });

});
app.post('/savescreensettings', function (req, res) {
    var screen = req.body.screen;
    var path = ROOT_URL + '/' + req.body.screenURL;
    var doc = req.body.document;
    var json = JSON.parse(doc);

    dropbox.client.put(path, JSON.stringify(json, null, 4), function (status, reply) {
        console.log(reply);
        console.log("screen settings saved".replace("screen", screen));
        res.send("okay");
    });
});
app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT_URL + reqpath;
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