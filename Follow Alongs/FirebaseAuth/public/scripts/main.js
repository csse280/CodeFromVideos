var rhit = rhit || {};

rhit.main = function () {
	console.log("Ready");
	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		console.log(`Sign out`);
	};
	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`Create account for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
	};
	document.querySelector("#logInButton").onclick = (event) => {
		console.log(`Log in for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
	
	};

};

rhit.main();
