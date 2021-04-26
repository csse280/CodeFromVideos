var rhit = rhit || {};

rhit.FB_COLLECTION_FAMILY_MEMBERS = "FamilyMembers";
rhit.FB_KEY_NAME = "name";
rhit.FB_KEY_IMG_URL = "imgUrl";
rhit.FB_KEY_CREATED = "created";
rhit.fbFamilyMembersCollectionManager = null;

// From: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.FamilyMember = class {
	constructor(id, name, imgUrl) {
		this.id = id;
		this.name = name;
		this.imgUrl = imgUrl;
	}
}

rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submit").addEventListener("click", (event) => {
			const name = document.querySelector("#nameInput").value;
			const imgUrl = document.querySelector("#pictureInput").value;

			console.log(`Name: ${name}   Image: ${imgUrl}`);
			rhit.fbFamilyMembersCollectionManager.add(name, imgUrl);

			// Optional...
			document.querySelector("#nameInput").value = "";
			document.querySelector("#pictureInput").value = "";
		});

		// // Start listening!
		rhit.fbFamilyMembersCollectionManager.beginListening(this.updateList.bind(this));
	}


	updateList() {
		// Make a new familyList
		const newList = htmlToElement('<div id="familyList" class="row justify-content-center"></div>');
		// Fill the familyList with family member elements using a loop
		for (let i = 0; i < rhit.fbFamilyMembersCollectionManager.length; i++) {
			const fm = rhit.fbFamilyMembersCollectionManager.getFamilyMemberAtIndex(i);
			const newCard = this._createCard(fm);
			newCard.onclick = (event) => {
				console.log(`You clicked on ${fm.name}`);
				rhit.fbFamilyMembersCollectionManager.delete(fm.id);
			};
			newList.appendChild(newCard);
		}

		// Remove the old familyList
		const oldList = document.querySelector("#familyList");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		// Put in the new familyList
		oldList.parentElement.appendChild(newList);
	}

	_createCard(familyMember) {
		return htmlToElement(`<div class="col-3 col-md-2">
		<img src="${familyMember.imgUrl}" class="img-fluid" alt="${familyMember.name}">
		<div class="text-center">${familyMember.name}</div>
	</div>`);
	}

}

rhit.FbFamilyMembersCollectionManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_FAMILY_MEMBERS);
		this._unsubscribe = null;
	}

	add(name, imgUrl) {
		// Add a new document with a generated id.
		this._ref.add({
				[rhit.FB_KEY_NAME]: name,
				[rhit.FB_KEY_IMG_URL]: imgUrl,
				[rhit.FB_KEY_CREATED]: firebase.firestore.Timestamp.now(),
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
			.orderBy(rhit.FB_KEY_CREATED)
			.limit(50)
			.onSnapshot((querySnapshot) => {
				console.log("FamilyMember update!");
				this._documentSnapshots = querySnapshot.docs;
				changeListener();
			});
	}

	stopListening() {
		this._unsubscribe();
	}

	delete(id) {
		this._ref.doc(id).delete();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getFamilyMemberAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const fm = new rhit.FamilyMember(docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_IMG_URL));
		return fm;
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	rhit.fbFamilyMembersCollectionManager = new rhit.FbFamilyMembersCollectionManager();
	new rhit.ListPageController();
};

rhit.main();