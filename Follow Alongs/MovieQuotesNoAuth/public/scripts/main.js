var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuoteManager = null;


rhit.ListPageController = class {
	constructor() {
		console.log("created ListPageController");
	}
	updateList() {}
}

rhit.MovieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class {
	constructor() {
		console.log("created FbMovieQuotesManager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
	}

	add(quote, movie) {
	}

	beginListening(changeListener) {}
	stopListening() {}
	// update(id, quote, movie) {}
	// delete(id) {}
	get length() {}
	getMovieQuoteAtIndex(index) {}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#listPage")) {
		console.log("You are on the list page.");
		rhit.fbMovieQuoteManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}
	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page.");

	}

	// Temp code for Read and Add
	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {
	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});
	// });

	// ref.add({
	// 	quote: "My second test",
	// 	movie: "My second movie",
	// 	lastTouched: firebase.firestore.Timestamp.now(),
	// });


};

rhit.main();