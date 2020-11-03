var express = require("express");
var app = express();
var cors = require("cors");

app.use( cors() );
require('./models/db');
const HelloEntry = require('./models/helloEntry');

const logger = require("morgan");
app.use( logger('dev') ); //helpful information serverside when requests come in


//middleware
var bodyParser = require("body-parser");
app.use('/api/', bodyParser.urlencoded( {extended: true}));
app.use('/api/', bodyParser.json() );

//READ ALL
app.get("/api/", function (req, res) {
    HelloEntry.find( {}, (err, entries) => {
        if (err) {
            res.json( err );
        } else {
            console.log( entries );
            res.json(  entries );
        }
    }  );
    //res.send( data );
    // res.end();
});

//CREATE 
app.post("/api/", function (req, res) {
    let name = req.body.name;
    let counter = req.body.count;
    HelloEntry.create( {
        name: name,
        count: counter
    }, (err, entry) => {
        if (err) {
            res.json(err);
        } else {
            res.json(entry);
        }
    });

});

//READ ONE
app.get("/api/id/:id", function (req, res) {
    let id =  req.params.id;
    HelloEntry.findById(id, (err, entry) => {
        if (err) {
            res.json(err);
        } else {
            res.json(entry);
        }
    });
    // let result = data[id];
    // res.send( result );
    // res.end();
}).put("/api/id/:id", function (req, res) {
    let id =  parseInt(req.params.id);
    let name = req.body.name;
    let counter = req.body.count;
    data[id] = {"name":name, "count": counter} ;
    saveToServer(data);
    res.send( "PUT successful!" );
    res.end();
}).delete("/api/id/:id", function (req, res) {
    let id =  parseInt(req.params.id);
    data.splice(id,1);
    saveToServer(data);
    res.send( "DELETE successful!" );
    res.end();
});



app.listen(3000);