<template>
	<div>
		<h1>{{ username }}</h1>
		<button @click="logOut">Logout</button>
		<p>Delete account</p>
		<p>All your notes</p>
		<div
			v-for="(country, key) in allUserNotes"
			:key="country.id"
			:data-country-id="country.id"
			class="notes__container"
		>
			<h2>{{ key }}</h2>
			<router-link
				:to="{
					name: 'Country',
					params: {
						region: country[0].region,
						country: key,
					},
				}"
			>
				<p>Check page</p>
			</router-link>
			<div
				v-for="note in country"
				:key="note.id"
				:data-note-id="note.id"
				class="single__note"
			>
				<div>
					<h3>Location</h3>
					<p>{{ note.location }}</p>
				</div>
				<div>
					<h3>Content</h3>
					<p>{{ note.content }}</p>
				</div>
				<div @click="deleteNote">X</div>
				<!-- <router-link
					:to="{
						name: 'Country',
						params: {
							region: note.region,
							country: key,
						},
						hash: '#' + note.id,
					}"
				>
					<p>Check page</p>
				</router-link> -->
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import {
		getFirestore,
		collection,
		getDocs,
		getDoc,
		query,
		where,
		onSnapshot,
		orderBy,
		deleteDoc,
		doc,
	} from "firebase/firestore";
	const db = getFirestore();
	import { getAuth, signOut } from "firebase/auth";
	const auth = getAuth();
	import { getStorage, ref, deleteObject } from "firebase/storage";
	const storage = getStorage();
	export default {
		name: "Profile",
		data() {
			return {
				allUserNotes: [],
			};
		},
		computed: mapState({
			username: (state) => state.username,
			userId: (state) => state.userId,
		}),
		// test: function () {
		// 	const filteredArr = this.allUserNotes.reduce((acc, obj) => {
		// 		//target[index] = key;
		// 		const cle = obj["country"];
		// 		console.log(acc);
		// 		console.log(cle);
		// 		//console.log(target.country, key.country, index);
		// 		if (!acc[cle]) {
		// 			acc[cle] = [];
		// 		}
		// 		acc[cle].push(obj);
		// 		return acc;
		// 	}, {});
		// 	return filteredArr;
		// },
		methods: {
			async getAllUserNotes() {
				this.allUserNotes = [];
				const request = query(
					collection(db, "notes"),
					where("userId", "==", this.userId),
					orderBy("country")
				);
				const requestSnapshot = await getDocs(request);
				onSnapshot(requestSnapshot.query, (snapShot) => {
					const arrayToReduce = []; //array to get data before applying reduce method
					console.log(snapShot);
					snapShot.forEach((doc) => {
						console.log(doc.data());
						arrayToReduce.push({ ...doc.data(), id: doc.id });
					});
					console.log(this.allUserNotes);
					this.allUserNotes = arrayToReduce.reduce((acc, obj) => {
						const cle = obj["country"];
						// console.log(acc);
						// console.log(cle);
						if (!acc[cle]) {
							acc[cle] = [];
						}
						acc[cle].push(obj);
						return acc;
					}, {});
					console.log(this.allUserNotes.guinea[0].region);
				});
			},
			logOut() {
				signOut(auth)
					.then(() => {
						console.log("Sign-out successful.");
						this.$router.push("/");
					})
					.catch((error) => {
						console.log(error);
					});
			},
			async deleteNote(e) {
				//const noteId = e.target.dataset.noteId;
				const noteId = e.target.parentElement.dataset.noteId;
				console.log(noteId);
				//delete from storage thanks to name of file

				const docRef = doc(db, "notes", noteId);
				const docSnap = await getDoc(docRef);
				console.log(docSnap.data());
				const urlRef = docSnap.data().photosUrl;
				console.log(urlRef.length);
				if (urlRef.length > 0) {
					for (let element of urlRef) {
						console.log(element);
						const fileRef = ref(storage, element);
						console.log(fileRef);
						deleteObject(fileRef)
							.then(() => {
								// File deleted successfully
							})
							.catch((error) => {
								console.log(error);
								// Uh-oh, an error occurred!
							});
					}
				}
				//delete from firestore thanks to id of document
				await deleteDoc(doc(db, "notes", noteId));
			},
		},
		beforeMount() {
			this.getAllUserNotes();
		},
		mounted() {
			//this.testOnArr();
		},
	};
</script>

<style scoped>
	.single__note {
		display: flex;
		justify-content: space-around;
	}
</style>
