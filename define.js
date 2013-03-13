var Entity = require('./entity.js'),context ;

/* Use exports.init with callback to pass "context" value to $data.Class.defineEx
 * Will be invoke from app.js and pass one function as callback.
 *
 */
exports.init = function(callback) {
    if (context) {
        console.log("Error when init");
        callback(null, context);
    } else {
        context = new Array();
        Entity.get(null,function(err,entities){
            if(err){
                entities = [];
            }
            //console.log("Total Reports:" + entities.length);

            entities.forEach(function(entity){
                var fullEntityName = "odataservice."+entity.EntityName;
                var key = entity.EntityName + "s";
                console.log("Key:" + key);
                console.log("Full Entity Name: " + fullEntityName);
                var oentity = $data.Class.define(fullEntityName, $data.Entity, null, entity.Properties, null);
                //Use OEntity instead of just name (string value not work for elementType)
                context[key] = {type: $data.EntitySet,elementType: oentity};
                //context = context + entity.EntityName + "s : { type: $data.EntitySet, elementType: odataservice." + entity.EntityName + "}, ";
            });
            callback(null,context);
        });
    }
};