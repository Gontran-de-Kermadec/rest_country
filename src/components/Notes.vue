<template>
	<div class="notes__container">
		<h2>Personal notebook</h2>
		<div class="switch__container">
			<p class="switch__visited switch__content">Visited</p>
			<p
				class="switch__toVisit switch__content"
				:class="toVisit"
				@click="toggleChoice"
			>
				To visit
			</p>
			<!-- <button @click="switchButton">{{ switchBtn }}</button> -->
		</div>
		<div v-if="isLogged && isemailVerified" class="logout__btn">
			<router-link
				:to="{ name: 'Profile', params: { username: username || 'jean' } }"
				>{{ username }}
			</router-link>
			<button @click="logOut">Log out</button>
		</div>
		<div v-if="isLogged && isemailVerified">
			<h3>Notes</h3>
			<AddNote />
			<div v-if="notes.length > 0">
				<SingleNote />
			</div>
			<div v-else>
				<p>No notes currently !!!</p>
			</div>
		</div>
		<div v-else-if="isLogged === false" class="not__connected">
			<!-- <p>Pas connecté</p> -->
			<p>To write notes, please</p>
			<div class="sign__buttons">
				<span @click="signingIn">Sign in </span>or
				<span @click="signingUp">Sign up</span>
			</div>
			<div v-if="isSignedUp">
				<Signup />
			</div>
			<div v-if="isSignedIn">
				<Signin />
			</div>
		</div>
		<div v-if="!isemailVerified && isLogged" class="email__alert">
			<p>Please verify your email by clicking on link in your inbox</p>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import AddNote from "./AddNote.vue";
	import Signin from "./Signin.vue";
	import Signup from "./Signup.vue";
	import "../firebaseConfig";
	import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
	import {
		getFirestore,
		collection,
		getDocs,
		query,
		where,
		onSnapshot,
		deleteDoc,
		doc,
	} from "firebase/firestore";
	import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
	import SingleNote from "./SingleNote.vue";
	const storage = getStorage();
	const db = getFirestore();
	const auth = getAuth();
	export default {
		name: "Notes",
		components: {
			Signin,
			Signup,
			AddNote,
			SingleNote,
		},
		data() {
			return {
				modalOn: false,
				isLogged: false,
				isSignedUp: false,
				isSignedIn: false,
				isemailVerified: false,
				visited: false,
				toVisit: "false",
			};
		},
		computed: mapState({
			userId: (state) => state.userId,
			location: (state) => state.location,
			notes: (state) => state.notes,
			imgUrl: (state) => state.imgsUrl,
			country: (state) => state.currentCountry,
			username: (state) => state.username,
		}),
		methods: {
			isEmailVerified() {
				onAuthStateChanged(auth, (user) => {
					console.log(user);
					// console.log(user.emailVerified);
					// if (!user.emailVerified) {
					// 	console.log("mail non verifié !!!");
					// 	this.isemailVerified = false;
					// } else {
					// 	console.log("mail verifié");
					// 	this.isemailVerified = true;
					// }
					if (user && user.emailVerified) {
						console.log("mail verifié");
						this.isemailVerified = true;
					} else {
						console.log("mail non verifié ou pas de user connecté !!!");
						this.isemailVerified = false;
					}
				});
			},
			isConnected() {
				onAuthStateChanged(auth, (user) => {
					if (user) {
						// User is signed in, see docs for a list of available properties
						// https://firebase.google.com/docs/reference/js/firebase.User
						const uid = user.uid;
						this.$store.commit("GET_USER_ID", {
							userId: uid,
						});
						this.isLogged = true;
						this.getUserName(uid);
						this.getNotes();
					} else {
						// User is signed out
						this.isLogged = false;
						this.clearNotes();
					}
				});
			},
			logOut() {
				signOut(auth)
					.then(() => {
						console.log("Sign-out successful.");
					})
					.catch((error) => {
						console.log(error);
					});
			},
			signingUp() {
				this.isSignedIn = false;
				this.isSignedUp = true;
			},
			signingIn() {
				this.isSignedUp = false;
				this.isSignedIn = true;
			},
			displayModal() {
				this.modalOn = !this.modalOn;
			},
			async getUserName(userId) {
				const request = query(
					collection(db, "users"),
					//where("country", "==", this.country),
					where("userId", "==", userId)
					// where("userId", "==", this.userId)
				);
				const requestSnapshot = await getDocs(request);
				console.log(requestSnapshot.query);
				onSnapshot(requestSnapshot.query, (snapShot) => {
					snapShot.forEach((doc) => {
						console.log(doc.data().username);
						const username = doc.data().username;
						this.$store.commit("GET_USERNAME", username);
					});
				});
			},
			//function to collect notes from database regarding user id and country selected
			async getNotes() {
				console.log(this.country, this.userId);
				const request = query(
					collection(db, "notes"),
					where("country", "==", this.country),
					where("userId", "==", this.userId)
				);
				const requestSnapshot = await getDocs(request);
				onSnapshot(requestSnapshot.query, (snapShot) => {
					this.$store.commit("SAVE_NOTES");
					snapShot.forEach((doc) => {
						this.$store.commit("SAVE_NOTES", {
							...doc.data(),
							id: doc.id,
						});
					});
				});
				console.log(this.notes);
				if (this.notes.length > 0) {
					console.log("true");
				} else {
					console.log("false");
				}
			},
			clearNotes() {
				this.notes = [];
			},
			async deleteNote(e) {
				console.log(e.path[3].dataset.noteId);
				const noteId = e.path[3].dataset.noteId;
				await deleteDoc(doc(db, "notes", noteId));
				console.log("succesfully deleted");
			},
			getImgs() {
				this.$store.commit("SAVE_IMGS");
				const listImg = ref(storage, `${this.userId}/${this.country}`);
				//const pathReference = ref(storage);
				list(listImg).then((img) => {
					img.items.forEach((x) => {
						console.log(x.fullPath);
						getDownloadURL(ref(storage, x.fullPath)).then((url) => {
							console.log(url);
							this.$store.commit("SAVE_IMGS", url);
						});
					});
				});
			},
			getImgsUrl() {
				console.log(this.notes);
			},
			toggleChoice() {
				console.log();
				this.toVisit = "true";
			},
		},
		beforeMount() {
			this.isConnected();
			this.isEmailVerified();
			this.getImgs();
			console.log(this.isemailVerified);
			console.log(this.isLogged);
		},
		mounted() {
			this.getImgsUrl();
			console.log(process.env.VUE_APP_ROOT_URL + this.$route.path);
		},
	};
</script>

<style scoped>
	.notes__container {
		padding: 2em 0;
	}
	.notes__container .logout__btn {
		text-align: right;
	}
	h2 {
		border-bottom: solid 1px;
	}
	.logout__btn {
		display: flex;
		justify-content: flex-end;
	}
	.logout__btn p {
		font-size: 2em;
		align-self: center;
	}
	.logout__btn button {
		all: unset;
		cursor: pointer;
		/* margin: 1em 0; */
		border: solid;
		padding: 0.5em 1em;
		background: lightyellow;
		margin: 0 1em;
	}
	.sign__buttons span {
		color: #000;
		cursor: pointer;
	}
	.sign__buttons span:hover {
		text-decoration: underline;
	}
	.not__connected {
		font-size: 1.5em;
	}
	.note__container {
		display: flex;
		justify-content: space-around;
		margin: 2em;
		border: solid 1px;
		border-radius: 1em;
	}
	.note__container h3 {
		border-bottom: solid;
		margin: 0;
		padding: 0.5em 0;
	}
	.note__container .note__location {
		width: 30%;
	}
	.note__container .note__content--title {
		position: relative;
	}
	.note__container .note__content button {
		position: absolute;
		right: 1em;
		top: 50%;
		transform: translateY(-50%);
	}
	.note__container div:nth-child(2) {
		width: 100%;
	}
	.email__alert {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 3em;
		background: yellow;
	}
	.switch__container {
		display: flex;
	}
	.switch__content {
		border: solid;
		padding: 0.5em 2em;
	}
</style>
