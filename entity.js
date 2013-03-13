var settings = require('./settings');

var mongodb = require('mongodb'),
    server = new mongodb.Server(settings.host, settings.port, {}),
    db = new mongodb.Db(settings.db, server);

function Entity(entity) {
    this.EntityName = entity.EntityName;
    this.ReportID = entity.ReportID;
    this.ProjectName = entity.ProjectName;
    this.Env = entity.Env;
    this.Properties = entity.Properties;
};

module.exports = Entity;

Entity.get = function get(entityname, callback) {
    db.open(function (error, client) {
        if (error) throw error;
        var query = {};
        if(entityname){
            query.entity = entityname;
        }
        var collection = new mongodb.Collection(client, 'reports');
        //query...
        collection.find({}, {}).toArray(function (err, docs) {
            if (err) {
                //mongodb.close();
                callback(err, null);
            }
            //mongodb.close();
            console.log("Total Docs:" + docs.length);
            var entities = [];
            docs.forEach(function(doc,index){
                var entity = new Entity(doc);
                //console.log("In entity.js:" + entity.EntityName);
                entities.push(entity);
            });
            console.log("Total Entities: " + entities.length);
            //console.log("Entity[0]:" + entities[0].EntityName);
            callback(null,entities);
        });
    });
};