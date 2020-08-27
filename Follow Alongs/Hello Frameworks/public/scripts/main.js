var rhit = rhit || {};

rhit.counter = 0;


rhit.main = function () {
	console.log("Ready");
	const buttons = document.querySelectorAll("#counterButtons button");
	// for (let i = 0; i < buttons.length; i++) {
	// 	const button = buttons[i];
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed`, button);
	// 	};
	// }

	for (const button of buttons) {
		button.onclick = (event) => {
			const dataAmount = parseInt(button.dataset.amount);
			const dataIsMultiplication = button.dataset.isMultiplication == "true";
			console.log(`Amount: ${dataAmount} isMult: ${dataIsMultiplication}`);
			console.log(`Amount: ${typeof(dataAmount)} isMult: ${typeof(dataIsMultiplication)}`);

			if (dataIsMultiplication) {
				console.log("This IS Truthy.  Use multiplication.");
			} else {
				console.log("Not multiplication.");
			}


		};
	}

	// buttons.forEach((button) => {
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed`, button);
	// 	};
	// });

};

rhit.updateCounter = function () {
	
};

rhit.main();
