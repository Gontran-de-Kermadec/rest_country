<template>
	<div class="switch__container">
		<div class="visited__container">
			<div class="visited__animation" :class="visit"></div>
			<div
				class="switch__visited switch__content"
				@click="visitOrToBeVisited('visit', visit)"
			>
				Visited
			</div>
		</div>
		<div class="toVisit__container">
			<div class="toVisit__animation" :class="toVisit"></div>
			<div
				class="switch__toVisit switch__content"
				@click="visitOrToBeVisited('toVisit', toVisit)"
			>
				to Visit
			</div>
		</div>
		<!-- <p
			class="switch__toVisit switch__content"
			:class="toVisit"
			@click="visitOrToBeVisited('toVisit', toVisit)"
		>
			To visit
		</p> -->
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import "../../firebaseConfig";
	import {
		getFirestore,
		collection,
		addDoc,
		doc,
		getDocs,
		query,
		where,
		updateDoc,
		arrayUnion,
		arrayRemove,
	} from "firebase/firestore";
	const db = getFirestore();
	export default {
		name: "IsVisited",
		data() {
			return {
				visitedCountries: [],
				toVisitCountries: [],
				visit: "",
				toVisit: "",
				docId: "",
			};
		},
		computed: mapState({
			userId: (state) => state.userId,
			country: (state) => state.currentCountry,
		}),
		methods: {
			async isVisitedOrTobeVisited() {
				const request = query(
					collection(db, "countriesVisit"),
					where("userId", "==", this.userId)
				);
				const requestSnapshot = await getDocs(request);
				requestSnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
					this.docId = doc.id;
					this.visitedCountries = doc.data().visitedCountries;
					this.toVisitCountries = doc.data().toVisitCountries;
					const isCountryVisited = doc
						.data()
						.visitedCountries.includes(this.country);
					const isCountryToBeVisited = doc
						.data()
						.toVisitCountries.includes(this.country);
					if (isCountryVisited) {
						this.visit = "true";
						this.toVisit = "";
					} else if (isCountryToBeVisited) {
						this.toVisit = "true";
						this.visit = "";
					}
				});
			},
			async visitOrToBeVisited(word, status) {
				console.log(word, status);
				if (word === "visit") {
					if (status === "true") {
						console.log("deja visite");
						this.visit = "";
						const docRef = doc(db, "countriesVisit", this.docId);
						await updateDoc(docRef, {
							visitedCountries: arrayRemove(this.country),
						});
						console.log("update done");
					} else {
						this.visit = "true";
						this.toVisit = "";
						const request = query(
							collection(db, "countriesVisit"),
							where("userId", "==", this.userId)
						);
						const requestSnapshot = await getDocs(request);
						console.log(requestSnapshot.empty);
						if (requestSnapshot.empty) {
							//Add a new document with a generated id.
							const docRef = await addDoc(collection(db, "countriesVisit"), {
								userId: this.userId,
								visitedCountries: this.visitedCountries,
								toVisitCountries: this.toVisitCountries,
							});
							console.log("Document written with ID: ", docRef.id);
						} else {
							const docRef = doc(db, "countriesVisit", this.docId);
							await updateDoc(docRef, {
								visitedCountries: arrayUnion(this.country),
							});
							await updateDoc(docRef, {
								toVisitCountries: arrayRemove(this.country),
							});
						}
					}
				} else if (word === "toVisit") {
					if (status) {
						console.log("deja a visiter");
						this.toVisit = "";
						const docRef = doc(db, "countriesVisit", this.docId);
						console.log(docRef);
						await updateDoc(docRef, {
							toVisitCountries: arrayRemove(this.country),
						});
						console.log("update done");
					} else {
						this.toVisit = "true";
						this.visit = "";
						const request = query(
							collection(db, "countriesVisit"),
							where("userId", "==", this.userId)
						);
						const requestSnapshot = await getDocs(request);
						if (requestSnapshot.empty) {
							//Add a new document with a generated id.
							const docRef = await addDoc(collection(db, "countriesVisit"), {
								userId: this.userId,
								visitedCountries: this.visitedCountries,
								toVisitCountries: this.toVisitCountries,
							});
							console.log("Document written with ID: ", docRef.id);
						} else {
							const docRef = doc(db, "countriesVisit", this.docId);
							await updateDoc(docRef, {
								toVisitCountries: arrayUnion(this.country),
							});
							await updateDoc(docRef, {
								visitedCountries: arrayRemove(this.country),
							});
						}
					}
				}
			},
		},
		beforeMount() {
			this.isVisitedOrTobeVisited();
		},
	};
</script>

<style scoped>
	.switch__container {
		display: flex;
		border: solid;
		border-radius: 25px;
	}
	.switch__content {
		padding: 0.5em 2em;
	}
	.visited__container,
	.toVisit__container {
		position: relative;
		overflow: hidden;
	}
	.visited__container,
	.visited__animation {
		border-bottom-left-radius: 17px;
		border-top-left-radius: 17px;
	}
	.visited__animation,
	.toVisit__animation {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		background: pink;
	}
	.visited__animation {
		transform: translateX(-100%);
		transition: transform 0.5s ease-in;
	}
	.toVisit__container,
	.toVisit__animation {
		border-bottom-right-radius: 17px;
		border-top-right-radius: 17px;
	}
	.toVisit__animation {
		transform: translateX(100%);
		transition: transform 0.5s ease-in;
	}
	.visited__animation.true,
	.toVisit__animation.true {
		transform: translateX(0);
		transition: transform 0.5s ease-in;
	}
</style>
