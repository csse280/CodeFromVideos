const myModule = require("./myOtherFile");

console.clear();
console.log( "Counter = ", myModule.getCounter() );
myModule.inc();
myModule.inc();
myModule.inc();
console.log( "Counter = ", myModule.getCounter() );
