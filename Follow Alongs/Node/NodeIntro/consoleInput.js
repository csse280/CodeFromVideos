console.clear();
process.stdout.write("What is your name? ");

process.stdin.on("data", (data) => {
    process.stdout.write("\nHello " + data.toString().trim() + "!\n" );
    process.exit();
} );