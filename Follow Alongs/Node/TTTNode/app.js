const express = require("express");

var app = express();
app.use(express.static("public"));


app.get("/api/getmove/:board", (request, response) => {
  const boardString = request.params.board;
  const openings = getOpenLocations(boardString);
  const moveSelected = openings[Math.floor(Math.random() * openings.length)];
  response.send({"move": moveSelected});
});


function getOpenLocations(boardString) {
  const openLocations = [];
  for (var i = 0; i < boardString.length; i++) {
    if (boardString.charAt(i) == '-') {
      openLocations.push(i)
    }
  }
  return openLocations;
 }


app.listen(3000);