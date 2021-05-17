var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;

// From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {

		// document.querySelector("#submitAddQuote").onclick = (event) => {
		// };
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);
		});

		$("#addQuoteDialog").on("show.bs.modal", (event) => {
			// Pre animation
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";
		});
		$("#addQuoteDialog").on("shown.bs.modal", (event) => {
			// Post animation
			document.querySelector("#inputQuote").focus();
		});

		// Start listening!
		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));

	}


	updateList() {
		console.log("I need to update the list on the page!");
		console.log(`Num quotes = ${rhit.fbMovieQuotesManager.length}`);
		// console.log("Example quote = ", rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(0));

		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="quoteListContainer"></div>');
		// Fill the quoteListContainer with quote cards using a loop
		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);
			newCard.onclick = (event) => {
				//console.log(`You clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`;
			};
			newList.appendChild(newCard);
		}


		// Remove the old quoteListContainer
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		// Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);
	}

	_createCard(movieQuote) {
		return htmlToElement(`<div class="card">
		<div class="card-body">
			<h5 class="card-title">${movieQuote.quote}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${movieQuote.movie}</h6>
		</div>
	</div>`);
	}

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
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		this._unsubscribe = null;
	}

	add(quote, movie) {
		// Add a new document with a generated id.
		this._ref.add({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref
			.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc")
			.limit(50)
			.onSnapshot((querySnapshot) => {
				console.log("MovieQuote update!");
				this._documentSnapshots = querySnapshot.docs;
				// querySnapshot.forEach((doc) => {
				// 	console.log(doc.data());
				// });
				changeListener();
			});
	}

	stopListening() {
		this._unsubscribe();
	}

	// update(id, quote, movie) {}
	// delete(id) {}
	get length() {
		return this._documentSnapshots.length;
	}

	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE));
		return mq;
	}
}

rhit.DetailPageController = class {
	constructor() {

		document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);
		});

		$("#editQuoteDialog").on("show.bs.modal", (event) => {
			// Pre animation
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;
		});
		$("#editQuoteDialog").on("shown.bs.modal", (event) => {
			// Post animation
			document.querySelector("#inputQuote").focus();
		});

		document.querySelector("#submitDeleteQuote").addEventListener("click", event => {
			rhit.fbSingleQuoteManager.delete().then(() => {
				console.log("Document successfully deleted!");
				window.location.href = "/";
			}).catch(error => console.error("Error removing document: ", error));
		});

		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView() {
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.movie;
		this.updatePoster();
		console.log("This happen WAY before poster stuff finishes");
	}

	async updatePoster() {
		const title = rhit.fbSingleQuoteManager.movie;
		const response = await fetch(`//www.omdbapi.com/?apikey=691ddc11&t=${title}`);
		const data = await response.json();
		console.log('Response data:', data);
		if (data["Response"] == "True" && data["Poster"].length > 5) {
			const posterImgEl = document.querySelector("#cardPoster");
			posterImgEl.src = data["Poster"];
			posterImgEl.alt = title;
			posterImgEl.style.display = "flex";
		} else {
			console.log("Missing poster data.  Do nothing.");
		}


		// fetch(`//www.omdbapi.com/?apikey=691ddc11&t=${title}`)
		// .then(response => response.json())
		// .then(data => {
		// 	console.log('Response data:', data);

		// 	// the API returns "True" or "False" to indicate success
		// 	// there is a chance there will be no url for a poster, then it lists "N/A"
		// 	if (data["Response"] == "True" && data["Poster"].length > 5) {
		// 		console.log("Show the poster in the HTML!");
		// 		const posterUrl = data["Poster"];
		// 		const posterImgEl = document.querySelector("#cardPoster");
		// 		posterImgEl.src = posterUrl;
		// 		posterImgEl.alt = title;
		// 		posterImgEl.style.display = "flex";
		// 	} else {
		// 		console.log("Missing poster data.  Do nothing.");
		// 	}
		// });

	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
				//window.location.href = "/";
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	update(quote, movie) {
		this._ref.update({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(() => {
				console.log("Document successfully updated!");
			})
			.catch(function (error) {
				// The document probably doesn't exist.
				console.error("Error updating document: ", error);
			});
	}

	delete() {
		return this._ref.delete();
	}

	get quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}

	get movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	if (document.querySelector("#listPage")) {
		console.log("You are on the list page.");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
	}
	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page.");
		//const movieQuoteId = rhit.storage.getMovieQuoteId();

		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");

		if (!movieQuoteId) {
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
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