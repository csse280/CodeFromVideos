var express = require("express");
var app = express();
var cors = require("cors");

app.use( cors() );
require('./models/db');
const HelloEntry = require('./models/helloEntry');

const logger = require("morgan");
app.use( logger('dev') ); //helpful information serverside when requests come in


//middleware
// var bodyParser = require("body-parser");
// app.use('/api/', bodyParser.urlencoded( {extended: true}));
// app.use('/api/', bodyParser.json() );

app.use('/api/', express.json());

//READ ALL
app.get("/api/", function (req, res) {
    HelloEntry.find( {}, (err, entries) => {
        if (err) {
            res.json( err );
            res.status( 404 );
        } else {
            res.status( 200 );
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
            res.status( 400 );
            res.json(err);
        } else {
            res.status( 201 );
            res.json(entry);
        }
    });

});

//READ ONE
app.get("/api/id/:id", function (req, res) {
    let id =  req.params.id;
    HelloEntry.findById(id, (err, entry) => {
        if (err) {
            res.status( 404 );
            res.json(err);
        } else {
            res.status( 200 );
            res.json(entry);
        }
    });
}).put("/api/id/:id", function (req, res) {
    let id = req.params.id;
    HelloEntry.findById( id, (err, helloEntry) => {
        helloEntry.name = req.body.name || helloEntry.name;
        helloEntry.count = req.body.count || helloEntry.count;
        helloEntry.save(  (err, entry) => {
            if (err) {
                res.status( 404 );
                res.json(err);
            } else {
                res.status( 201 );
                res.json(entry);
            }
        });
    });
}).delete("/api/id/:id", function (req, res) {
    let id =  req.params.id;
    HelloEntry.findByIdAndDelete( id, (err, helloEntry) => {
        if (err) {
            res.status( 404 );
            res.json(err);
        } else {
            res.status( 204 );
            res.json(null);
        }
    });
   
});



app.listen(3000);