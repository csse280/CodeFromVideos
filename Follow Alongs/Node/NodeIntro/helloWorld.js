// let hello = "Hello CSSE280!"
// for (let k=0; k< 10; k++) {
//     setTimeout( () => {
//         console.log(k, hello );
//     }, k*1000);
// }

let counter= 0;
setInterval( () => {
    counter++;
    console.log("counter", counter);
}, 500);
