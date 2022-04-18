<template>
	<div>
		<header class="profile__header">
			<router-link :to="{ name: 'Homepage' }">Homepage</router-link>
			<p>Hi {{ username }} !</p>
			<button @click="logOut">Logout</button>
		</header>
		<section class="profile__resume">
			<p>Visited countries: x</p>
			<p>To visit countries: x</p>
			<p>Delete account</p>
			<p>Update profile</p>
		</section>
		<h1>Your notes</h1>
		<div class="allnotes__container">
			<div
				v-for="(country, key) in allUserNotes"
				:key="country.id"
				:data-country-id="country.id"
				class="notes__container"
			>
				<div class="note__country">
					<h2>{{ key }}</h2>
					<router-link
						:to="{
							name: 'Country',
							params: {
								region: country[0].region,
								country: key,
							},
						}"
						class="note__country--link"
					>
						Check page
					</router-link>
				</div>
				<!-- <div
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
					<div @click="deleteNote" class="single__note--delete">X</div>
				</div> -->
				<table>
					<thead>
						<tr>
							<th>Location</th>
							<th>Content</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="note in country" :key="note.id" :data-note-id="note.id">
							<td>{{ note.location }}</td>
							<td>{{ note.content }}</td>
							<td @click="deleteNote" class="single__note--delete">X</td>
						</tr>
					</tbody>
				</table>
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
		mounted() {},
	};
</script>

<style scoped>
	.profile__header {
		display: flex;
		justify-content: space-between;
	}
	.profile__header a,
	.profile__header button {
		all: unset;
	}
	.allnotes__container {
		margin: 0 5em;
	}
	.note__country {
		display: flex;
		justify-content: space-between;
		margin: 2em 0;
	}
	h2 {
		text-align: left;
		text-transform: capitalize;
	}
	/* .single__note {
		display: flex;
		justify-content: space-between;
	} */
	.note__country--link {
		align-self: center;
		color: lightgray;
		text-decoration: none;
		/* margin: 0 2em; */
	}
	table {
		all: unset;
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
	}
	thead {
		border-bottom: solid;
	}
	thead th {
		width: 30vw;
		padding: 1em;
	}
	tbody tr {
		border-top: solid 1px;
	}
	tbody td {
		padding: 1em;
		word-break: break-all;
	}
	.single__note--delete {
		transform: translateX(40px);
		opacity: 0;
		cursor: pointer;
		transition: all 0.5s;
	}
	tbody tr:hover .single__note--delete {
		opacity: 1;
		transition: all 0.5s;
	}
</style>
