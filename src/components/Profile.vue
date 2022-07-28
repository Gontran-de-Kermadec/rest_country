<template>
	<div>
		<Header_button
			left-button-id="Homepage"
			right-button-id="logout"
			region=""
		/>
		<p class="hi_username">Hi {{ username }} !</p>
		<section class="profile__resume">
			<div class="resume__countries">
				<div class="resume__countries__flex">
					<div class="countries__visited">
						<p class="countries__visited__number">
							Visited countries: {{ visitedCountries }}
						</p>
						<div class="visited__list__container">
							<div
								v-for="(country, index) in visitedCountriesList"
								:key="index"
								class="visited__list"
							>
								<p>{{ country }}</p>
							</div>
						</div>
					</div>
					<div class="countries__toVisit">
						<p class="countries__toVisit__number">
							To visit countries: {{ toVisitCountries }}
						</p>
						<div class="toVisit__list__container">
							<div
								v-for="(country, index) in toVisitCountriesList"
								:key="index"
								class="toVisit__list"
							>
								<p>{{ country }}</p>
							</div>
						</div>
					</div>
				</div>
				<p @click="resetPassword" class="resume__countries__password">
					Reset password
				</p>
			</div>
		</section>
		<h1>Notes summary</h1>
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
	import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
	const auth = getAuth();
	import { getStorage, ref, deleteObject } from "firebase/storage";
	import Header_button from "./small_components/Header_button.vue";
	const storage = getStorage();
	export default {
		name: "Profile",
		data() {
			return {
				allUserNotes: [],
				visitedCountries: "",
				visitedCountriesList: [],
				toVisitCountries: "",
				toVisitCountriesList: [],
			};
		},
		computed: mapState({
			username: (state) => state.username,
			userId: (state) => state.userId,
			region: (state) => state.currentRegion,
			country: (state) => state.currentCountry,
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
					snapShot.forEach((doc) => {
						arrayToReduce.push({ ...doc.data(), id: doc.id });
					});
					this.allUserNotes = arrayToReduce.reduce((acc, obj) => {
						const cle = obj["country"];
						if (!acc[cle]) {
							acc[cle] = [];
						}
						acc[cle].push(obj);
						return acc;
					}, {});
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
				const noteId = e.target.parentElement.dataset.noteId;
				//delete from storage thanks to name of file
				const docRef = doc(db, "notes", noteId);
				const docSnap = await getDoc(docRef);
				const urlRef = docSnap.data().photosUrl;
				if (urlRef.length > 0) {
					for (let element of urlRef) {
						const fileRef = ref(storage, element);
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
			async getVisitedCountries() {
				const request = query(
					collection(db, "countriesVisit"),
					where("userId", "==", this.userId)
				);
				const requestSnapshot = await getDocs(request);
				requestSnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
					this.docId = doc.id;
					//this.visitedCountriesList = doc.data().visitedCountries;
					this.capitalizeFirstLetter(doc.data().visitedCountries, "visited");
					this.visitedCountries = doc.data().visitedCountries.length;
					this.capitalizeFirstLetter(doc.data().toVisitCountries, "toVisit");
					//this.toVisitCountriesList = doc.data().toVisitCountries;
					this.toVisitCountries = doc.data().toVisitCountries.length;
				});
			},
			capitalizeFirstLetter(data, visitingStatus) {
				const countries = data;
				const capitalizedCountries = countries.map((country) => {
					return country.charAt(0).toUpperCase() + country.slice(1);
				});
				if (visitingStatus === "visited") {
					this.visitedCountriesList = capitalizedCountries;
				} else {
					this.toVisitCountriesList = capitalizedCountries;
				}
			},
			resetPassword() {
				const region =
					this.region.charAt(0).toUpperCase() + this.region.slice(1);
				const country =
					this.country.charAt(0).toUpperCase() + this.country.slice(1);
				const actionCodeSettings = {
					url: "http://localhost:8080/" + region + "/" + country,
				};
				console.log(auth.currentUser.email);
				sendPasswordResetEmail(auth, auth.currentUser.email, actionCodeSettings)
					.then(() => {
						console.log("reset email sent");
						alert("Password resert email sent !! Have a look in your spam.");
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.log(errorCode, errorMessage);
					});
			},
		},
		beforeMount() {
			this.getVisitedCountries();
			this.getAllUserNotes();
		},
		mounted() {},
		components: { Header_button },
	};
</script>

<style scoped>
	.header__links {
		position: relative;
		font-size: 2em;
		display: flex;
		justify-content: space-between;
	}
	.profile__header {
		display: flex;
		justify-content: space-between;
		padding: 2em 1em;
		font-size: 1.2em;
	}
	.hi_username {
		padding: 0.5em 0;
		font-size: 2em;
	}
	h1 {
		background: #dddde3;
		border-bottom: solid 1px;
		padding: 0.5em 0;
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

	.note__country--link {
		align-self: center;
		color: #dddde3;
		text-decoration: none;
	}
	.note__country--link:hover {
		color: #0d1f2d;
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
		word-break: break-word;
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
	.profile__resume {
		margin: 4em 1em;
	}
	.resume__countries {
		display: flex;
		justify-content: space-between;
	}
	.resume__countries__flex {
		display: flex;
	}
	.resume__countries__password {
		border: none;
		background-color: #0d1f2d;
		font-size: 1.2em;
		padding: 0.5em;
		color: #fff;
		cursor: pointer;
	}

	.countries__visited,
	.countries__toVisit {
		position: relative;
		background-color: #dddde3;
		padding: 0.5em 1em;
		box-shadow: 0 0 5px 2px;
		border-radius: 0.3em;
		/* transition: background-color 0.5s; */
		transition: all 0.5s;
		margin: 0 0.5em;
	}
	.countries__visited:hover,
	.countries__toVisit:hover {
		box-shadow: 0 0 2px 1px;
		background: #0d1f2d;
		color: #fff;
		transition: color 0.5s;
	}
	.visited__list__container,
	.toVisit__list__container {
		position: absolute;
		opacity: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		border-radius: 1em;
		border: solid #0d1f2d 1px;
		padding: 0.5em;
		width: 32vw;
		background: #dddde3;
		transition: opacity 0.5s;
		z-index: -10;
	}
	.countries__toVisit__number,
	.countries__visited__number {
		font-size: 1.2em;
	}
	.visited__list,
	.toVisit__list {
		margin: 0.3em;
		width: 7em;
		text-align: center;
		color: #0d1f2d;
	}
	.countries__visited:hover > .visited__list__container,
	.countries__toVisit:hover > .toVisit__list__container {
		opacity: 1;
		transition: opacity 0.5s;
		z-index: 10;
	}
</style>
