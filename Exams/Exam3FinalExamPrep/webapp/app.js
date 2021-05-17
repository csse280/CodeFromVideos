var express = require("express");
var app = express();

let data = {};

const fs = require("fs");
const serverSideStorage = "../data/db.json";

fs.readFile(serverSideStorage, function (err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
    }
    console.log("Data read from file.");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function (err, buf) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("Data saved successfully!");
        }
    })
}

app.use('/', express.static("public"));

//middleware
// Instead of using
// var bodyParser = require("body-parser");
// app.use('/api/', bodyParser.json());

// Use...
app.use('/api/', express.json());

// Pass in an array with 4 values to set all the Pars
app.put("/api/pars", function (req, res) {
    let pars = req.body.pars; // In our exams we can assume good users
    data["pars"] = pars;
    saveToServer(data);
    res.json({
        "pars": data["pars"]
    })
});

// Pass in 1 value, to set 1 hole's par
app.put("/api/par/:hole", function (req, res) {
    let hole = parseInt(req.params.hole);
    let par = req.body.par;
    data["pars"][hole - 1] = par;
    saveToServer(data);
    res.json({
        "par": par
    });
});


// Pass in an array with 4 values to set all the scores
app.put("/api/scores", function (req, res) {
    let scores = req.body.scores; // In our exams we can assume good users
    data["scores"] = scores;
    saveToServer(data);
    res.json({
        "scores": data["scores"]
    })
});

// Pass in 1 value, to set 1 hole's score
app.put("/api/score/:hole", function (req, res) {
    let hole = parseInt(req.params.hole);
    let score = req.body.score;
    data["scores"][hole - 1] = score;
    saveToServer(data);
    res.json({
        "score": score
    });
});




app.get("/api/pars", function (req, res) {
    res.json({
        "pars": data["pars"]
    })
});

app.get("/api/scores", function (req, res) {
    res.json({
        "scores": data["scores"]
    })
});


//READ ALL
// app.get("/api/", function (req, res) {
//     res.send( data );
//     res.end();
// });

//CREATE 
// app.post("/api/", function (req, res) {
//     let name = req.body.name;
//     let counter = req.body.count;
//     data.push( {"name":name, "count": counter}   );
//     saveToServer(data)
//     res.send( "POST successful!" );
//     res.end();
// });

//READ ONE
// app.get("/api/id/:id", function (req, res) {
//     let id =  parseInt(req.params.id);
//     let result = data[id];
//     res.send( result );
//     res.end();
// }).put("/api/id/:id", function (req, res) {
//     let id =  parseInt(req.params.id);
//     let name = req.body.name;
//     let counter = req.body.count;
//     data[id] = {"name":name, "count": counter} ;
//     saveToServer(data);
//     res.send( "PUT successful!" );
//     res.end();
// }).delete("/api/id/:id", function (req, res) {
//     let id =  parseInt(req.params.id);
//     data.splice(id,1);
//     saveToServer(data);
//     res.send( "DELETE successful!" );
//     res.end();
// });

app.listen(3000);