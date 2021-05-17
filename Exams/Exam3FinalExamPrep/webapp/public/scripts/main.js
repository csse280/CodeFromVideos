var rhit = rhit || {};

/** globals */
rhit.apiManager;


rhit.ApiManager = class {
	constructor() {

		this.pars = [0,0,0,0];
		this.scores = [0,0,0,0];
	}

	async sendPars(pars) {
		const url = "/api/pars";
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({
				"pars": pars
			}),
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log("Pars response data: ", data);
		this.pars = data["pars"];
	}

	async sendScores(scores) {
		const url = "/api/scores";
		const options = {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({
				"scores": scores
			}),
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log("Scores response data: ", data);
		this.scores = data["scores"];
	}

	async getPars(callback) {
		const response = await fetch("/api/pars");
		const data = await response.json();
		console.log("Pars response data: ", data);
		this.pars = data["pars"];

		callback();
	}


	async getScores(callback) {

	}
}

rhit.GolfController = class {
	constructor() {

		rhit.apiManager.getPars(this.updateView.bind(this));

		this.parInputs = [
			document.querySelector("#hole1Par"),
			document.querySelector("#hole2Par"),
			document.querySelector("#hole3Par"),
			document.querySelector("#hole4Par"),
		];
		this.scoreInputs = [
			document.querySelector("#hole1Score"),
			document.querySelector("#hole2Score"),
			document.querySelector("#hole3Score"),
			document.querySelector("#hole4Score"),
		];

		document.querySelector("#submitPars").onclick = (event) => {
			const pars = [
				parseInt(this.parInputs[0].value),
				parseInt(this.parInputs[1].value),
				parseInt(this.parInputs[2].value),
				parseInt(this.parInputs[3].value),
			];
			// console.log(`TODO: Update the pars ${pars} `);
			rhit.apiManager.sendPars(pars);
		}

		document.querySelector("#submitScores").onclick = (event) => {
			const scores = [
				parseInt(this.scoreInputs[0].value),
				parseInt(this.scoreInputs[1].value),
				parseInt(this.scoreInputs[2].value),
				parseInt(this.scoreInputs[3].value),
			];
			// console.log(`TODO: Update the scores ${scores} `);
			rhit.apiManager.sendScores(scores);
		}

	}

	updateView() {
		this.parInputs[0].value = rhit.apiManager.pars[0];
		this.parInputs[1].value = rhit.apiManager.pars[1];
		this.parInputs[2].value = rhit.apiManager.pars[2];
		this.parInputs[3].value = rhit.apiManager.pars[3];
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.apiManager = new rhit.ApiManager();
	new rhit.GolfController();
};

rhit.main();