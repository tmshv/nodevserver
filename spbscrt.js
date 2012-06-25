var mongo = require('mongoskin');
var fs = require('fs');

var database = mongo.db('tmshv:tmshv@flame.mongohq.com:27108/spbscrt');

var spbscrt = {
    save: function(screen, doc, callback){
        database.collection('screens').update({screen: screen}, {$set:{doc: doc}}, {upsert:true}, function(err, items){
            if(err) throw err;
            callback("okay");
        });
    },

    saveScreenSettings: function(screen, settings, callback){

    },

    get: function(screen, callback){
        database.collection('screens').find({screen: screen}).toArray(function(err, result) {
            if (err) throw err;
            var elem = result[0];
            if(elem){
                callback(result[0].doc);
            }else{
                callback('');
            }
        });
    }
};

exports.spbscrt = spbscrt;