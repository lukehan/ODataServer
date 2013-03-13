var c = require('express');
var url = require('url');
require('jaydata');
window.DOMParser = require('xmldom').DOMParser;
require('q');
var odataContext = "odataservice.Context";
require('./define').init(function (err, context) {
    //console.log("Context: " + context);

    //Define OData Entity Context
    $data.Class.defineEx(odataContext, [$data.EntityContext, $data.ServiceBase], null,
        context
    );

    initExpress();
});

function initExpress(){
    //init express
    var app = c();
    app.use(c.query());
    app.use(c.bodyParser());
    app.use(c.cookieParser());
    app.use(c.methodOverride());
    app.use(c.session({ secret: 'session key' }));
    // Authenticator
    app.use(c.basicAuth('admin', 'admin'));
    app.use("/odata.svc", $data.JayService.OData.Utils.simpleBodyReader());
    app.use("/odata.svc", $data.JayService.createAdapter(odataservice.Context, function (req, res) {
        return new odataservice.Context({name: "mongoDB", databaseName: "odataservice", address: "localhost", port: 27017 });
        //return new test.Context( { name: "sqLite", databaseName: "testdb", dbCreation: $data.storageProviders.sqLite.DbCreationType.Merge}
    }));
    app.use("/", c.static(__dirname));
    //get remote ip for trusted IP
    app.use("/", function (req, res) {
        //var queryData = url.parse(req.url, true).query;

        //console.log("userid:" + queryData[0]);
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        console.log("ip:" + ip + ", with method:" + req.method);

    });
    /*    app.use('/', function(req, res){
     res.render('index', {
     title: 'Home'
     });
     });*/

    app.use(c.errorHandler());
    app.listen(8000);
}

