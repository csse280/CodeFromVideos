var rhit = rhit || {};

rhit.PageController = class {
	constructor() {
		this.game = new rhit.Game();
	}

	updateView() {

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
		// temp test
		this.board[buttonIndex] = rhit.Game.Mark.X;
	}

	getMarkAtIndex(buttonIndex) {
		return this.board[buttonIndex];
	}

	getState() {
		return this.state;
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
