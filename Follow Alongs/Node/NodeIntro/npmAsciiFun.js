console.log("TODO: learn to use npm!");

// var figlet = require('figlet');
 
// figlet('CSSE280 using NodeJs', function(err, data) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data)
// });

const imgToAscii = require('ascii-img-canvas-nodejs')
 
const opts = {}
 
 
const asciiImgLocal = imgToAscii('files/node_logo.svg', opts);
asciiImgLocal.then(  (asciiImgLocal) => {
    console.log( asciiImgLocal );
}  );