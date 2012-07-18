var dropbox = require("./dropbox").dropbox;
var express = require("express");
var fs = require("fs");

var FRESH = false;//true;
var DEFAULT_PORT = 1337;
var rootPublic = __dirname + '/www';
var rootTemplates = __dirname + '/templates';
var ROOT = "/SPBSCRT";
var GENERATED_PATH = ROOT + "/dyn";

var CACHE_PATH = process.env.HOME + "/dropbox_cache";
var CACHE_DICT_PATH = process.env.HOME + "/dropbox_cache_dict.json";

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

app.post('/saveLogic', function (req, res) {
    var screen = req.body.screen;
    var path = GENERATED_PATH + "/" + screen + "_logic.json";
    var doc = req.body.document;
    var json = JSON.parse(doc);

    dropbox.client.put(path, JSON.stringify(json, null, 4), function (status, reply) {
        console.log("%s logic saved", screen);
        res.send("okay");
    });
});
app.post('/saveParams', function (req, res) {
    var screen = req.body.screen;
    var path = GENERATED_PATH + "/" + screen + "_params.json";
    var doc = req.body.document;
    var json = JSON.parse(doc);

    dropbox.client.put(path, JSON.stringify(json, null, 4), function (status, reply) {
        console.log("%s params saved", screen);
        res.send("okay");
    });
});
app.get("*", function (req, res) {
    var reqpath = req.params[0];
    var filepath = ROOT + reqpath;
    console.log("obtaining file " + filepath);
    dropbox.client.metadata(filepath, function (status, reply) {
        if (reply.error) {
            console.error("cannot obtain metadata for %s", filepath);
            res.send("file not found", 404);
        } else {
            var cache_dict;
            var remote_revision = reply.revision;
            var cached_revision = 0;

            //read 'cache dict' file
            fs.readFile(CACHE_DICT_PATH, function (err, data) {
                if (err) {
                    console.error("cache dict file not found");
                    cache_dict = [];
                }else{
                    cache_dict = JSON.parse(data.toString());
                }

                for (var i=0; i<cache_dict.length; i++) {
                    var cache_item = cache_dict[i];
                    if (cache_item.path == filepath) {
                        cached_revision = cache_item.revision;
                        break;
                    }
                }

                //download new file from dropbox
                if (cached_revision < remote_revision) {
                    dropbox.client.get(filepath, function (status, reply) {
                        try{
                            var json_reply = JSON.parse(reply);
                        }catch(parseError){
                        }

                        if(json_reply && json_reply.error) {
                            console.error("cannot send %s: %s", filepath, json_reply.error);
                            res.send(reply, 404);
                        }else{
                            console.log("send dropbox file %s", filepath);
                            updateCachedFile(cache_dict, filepath, remote_revision, reply);
                            res.contentType(filepath);
                            res.send(reply);
                        }
                    });
                }

                //send cached file
                else {
                    console.log("send cached file %s", filepath);
                    fs.readFile(cache_item.filepath, function (err, data) {
                        res.contentType(filepath);
                        res.send(data);
                    });
                }
            });
        }
    });

});

function updateCachedFile(dict, filepath, newRevision, fileData) {
    var current_item;
    for (var i=0; i<dict.length; i++) {
        var item = dict[i];
        if (item.path == filepath) {
            item.revision = newRevision;
            current_item = item;
            break;
        }
    }
    if (!current_item) {
        current_item = {
            path:filepath,
            revision:newRevision,
            filepath:CACHE_PATH + "/" + new Date().getTime().toString(0x10).toLowerCase()
        };
        dict.push(current_item);
    }
    var cached_path = current_item.filepath;
    fs.writeFile(cached_path, fileData, function (writeResult) {
        console.log("file %s cached", filepath);
    });
    fs.writeFile(CACHE_DICT_PATH, JSON.stringify(dict, null, 4), function (saveResult) {
        console.log("cache dict updated");
    });
}

function startListening() {
    app.listen(DEFAULT_PORT);
    var addr = app.address();
    console.log("start!");
}