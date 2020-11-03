var rhit = rhit || {};

rhit.PageController = class {
	constructor() {
		this.game = new rhit.Game();

		const squares = document.querySelectorAll(".square");
		for (const square of squares) {
			square.onclick = (event) => {
				const buttonIndex = parseInt(square.dataset.buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			};
		}
		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		};
		this.updateView();
	}

	updateView() {
		const squares = document.querySelectorAll(".square");
		squares.forEach((square, index) => {
			square.innerHTML = this.game.getMarkAtIndex(index);
		});
		document.querySelector("#gameStateText").innerHTML = this.game.state;

		// TODO: Have the server make a move IF the turn is O_TURN
		if (this.game.isOTurn) {
			const boardString = this.game.boardString;
			// fetch(`/api/getmove/${boardString}`).then((response) => {
			// 	console.log(response);
			// 	return response.json();
			// }).then((data) => {
			// 	console.log(data);
			// });

			// fetch(`/api/getmove/${boardString}`)
			fetch(`http://localhost:5001/fisherds-cloudfunctions/us-central1/api/getmove/${boardString}`)
				.then(response => response.json())
				.then(data => {
					console.log("Received", data);
					this.game.pressedButtonAtIndex(data.move);
					this.updateView();
				});
		}

	}
};

rhit.Game = class {

	static Mark = {
		X: "X",
		O: "O",
		NONE: " "
	}

	static State = {
		X_TURN: "X's Turn",
		O_TURN: "O's Turn",
		X_WIN: "X Wins!",
		O_WIN: "O Wins!",
		TIE: "Tie Game"
	}

	constructor() {
		this.state = rhit.Game.State.X_TURN;
		this.board = [];
		for (let k = 0; k < 9; k++) {
			this.board.push(rhit.Game.Mark.NONE);
		}
	}

	pressedButtonAtIndex(buttonIndex) {
		if (this.state == rhit.Game.State.X_WIN ||
			this.state == rhit.Game.State.O_WIN ||
			this.state == rhit.Game.State.TIE) {
			console.log("The game is over");
			return;
		}
		if (this.board[buttonIndex] != rhit.Game.Mark.NONE) {
			console.log("The square is not empty");
			return;
		}
		if (this.state == rhit.Game.State.X_TURN) {
			this.board[buttonIndex] = rhit.Game.Mark.X;
			this.state = rhit.Game.State.O_TURN;
		} else {
			this.board[buttonIndex] = rhit.Game.Mark.O;
			this.state = rhit.Game.State.X_TURN;
		}
		this._checkForGameOver();
	}

	_checkForGameOver() {
		// Check for a tie game
		if (!this.board.includes(rhit.Game.Mark.NONE)) {
			this.state = rhit.Game.State.TIE;
		}
		const linesOf3 = [];
		linesOf3.push(this.board[0] + this.board[1] + this.board[2]);
		linesOf3.push(this.board[3] + this.board[4] + this.board[5]);
		linesOf3.push(this.board[6] + this.board[7] + this.board[8]);

		linesOf3.push(this.board[0] + this.board[3] + this.board[6]);
		linesOf3.push(this.board[1] + this.board[4] + this.board[7]);
		linesOf3.push(this.board[2] + this.board[5] + this.board[8]);

		linesOf3.push(this.board[0] + this.board[4] + this.board[8]);
		linesOf3.push(this.board[2] + this.board[4] + this.board[6]);

		for (const lineOf3 of linesOf3) {
			if (lineOf3 == "XXX") {
				this.state = rhit.Game.State.X_WIN;
			} else if (lineOf3 == "OOO") {
				this.state = rhit.Game.State.O_WIN;
			}
		}
	}

	getMarkAtIndex(buttonIndex) {
		return this.board[buttonIndex];
	}

	getState() {
		return this.state;
	}

	get isOTurn() {
		return this.state == rhit.Game.State.O_TURN;
	}

	get boardString() {
		let boardString = "";
		for (let k = 0; k < 9; k++) {
			if (this.board[k] == rhit.Game.Mark.NONE) {
				boardString += "-";
			} else {
				boardString += this.board[k];
			}
		}
		return boardString;
	}

};

rhit.main = function () {
	console.log("Ready");
	new rhit.PageController();

	// Note: you could develop the model first doing stuff like this...
	// const myGame = new rhit.Game();
	// console.log('this.board = ', myGame.board);
	// console.log('this.state = ', myGame.state);
	// myGame.pressedButtonAtIndex(4);
	// console.log('this.board = ', myGame.board);
	// console.log('this.state = ', myGame.state);
};

rhit.main();