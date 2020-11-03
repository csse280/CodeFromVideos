const apiURL = "http://localhost:3000/api/"
var selectedId = "";
var editEntryMode = false;

var counter = 0;

function main() {
  console.log("Ready");

  document.querySelector("#decButton").onclick = (event) => {
    counter = counter - 1;
    updateView();
  };
  document.querySelector("#resetButton").onclick = (event) => {
    counter = 0;
    updateView();
  };
  document.querySelector("#incButton").onclick = (event) => {
    counter = counter + 1;
    updateView();
  };

  loadEntries(); //get the data from server and populate our entries

}

function updateView() {
  // document.querySelector("#counterText").innerHTML = "Count = " + counter;
  document.querySelector("#counterText").innerHTML = `Count = ${counter}`;
}

function loadEntries() {
  document.querySelector("#displayEntries").innerHTML ="";
  let allEntries = fetch( apiURL )
    .then( response => response.json() )
    .then( data => {
      for (let i=0; i< data.length; i++) {
        document.querySelector("#displayEntries").innerHTML += 
        `<button id="id${i}">Select Entry</button><label>${data[i].name}</label>` +
        `&nbsp;<label>${data[i].count}</label><br>`;
      }
    });


}




main();
