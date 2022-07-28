<template>
	<div>
		<button @click="displayModal" class="active__modal">Add Note</button>
		<div v-if="modalOn" class="modal" @click.self="displayModal">
			<div class="form__container">
				<form class="form__add">
					<div class="form__control">
						<input
							name="location"
							id="location"
							placeholder="Enter location"
							v-model="location"
							required
						/>
					</div>
					<div class="form__control">
						<div class="form__label">
							<label for="newNote">Note:</label>
						</div>
						<textarea
							name="newNote"
							id="newNote"
							v-model="note"
							required
						></textarea>
					</div>
					<div class="form__control">
						<label for="form_img">Add images:</label>
						<input
							type="file"
							id="form_img"
							accept="image/png, image/jpeg"
							multiple
							@change="getImgName"
						/>
					</div>
					<div class="form__control" id="add__btn">
						<button @click.prevent="saveNote">Add Note</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import "../firebaseConfig";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { getFirestore, collection, addDoc } from "firebase/firestore";
	import {
		getDownloadURL,
		getStorage,
		ref,
		uploadBytesResumable,
		//uploadBytes,
	} from "firebase/storage";
	//import { getDatabase, ref, onValue } from "firebase/database";
	const db = getFirestore();
	const auth = getAuth();
	const storage = getStorage();
	//const readData = getDatabase();
	export default {
		name: "AddNotes",
		//props: ["selectedCountry"],
		data() {
			return {
				modalOn: false,
				//country: this.selectedCountry,
				note: "",
				location: "",
				user: "",
				addedPhotos: [],
				urlImg: "",
				allImgUrl: [],
			};
		},
		computed: mapState({
			country: (state) => state.currentCountry,
			region: (state) => state.currentRegion,
			userId: (state) => state.userId,
			currentPhotosUrl: (state) => state.currentPhotosUrl,
			imgsUrl: (state) => state.imgsUrl,
		}),
		methods: {
			displayModal() {
				this.modalOn = !this.modalOn;
			},
			getImgName(e) {
				this.addedPhotos = [];
				console.log(e.target.files);
				for (let i = 0; i < e.target.files.length; i++) {
					//this.photo = [...e.target.files[i]];
					this.addedPhotos.push(e.target.files[i]);
				}
			},
			async multipleFile() {
				//console.log(e.target.files);
				//const files = e.target.files;
				const files = this.addedPhotos;
				for (const file of files) {
					const imgRef = ref(
						storage,
						`${this.userId}/${this.country}/${file.name + file.size}`
					);
					const uploadTask = await uploadBytesResumable(imgRef, file);
					const test = await getDownloadURL(uploadTask.ref);
					console.log(test);
					this.allImgUrl.push(test);
				}
				// files.forEach(async (file) => {
				// 	const imgRef = ref(
				// 		storage,
				// 		`${this.userId}/${this.country}/${file.name + file.size}`
				// 	);
				// 	const uploadTask = await uploadBytesResumable(imgRef, file);
				// 	const test = getDownloadURL(uploadTask.ref);
				// 	this.allImgUrl.push(test);
				// });
				console.log(this.allImgUrl);
			},
			async onFileChange(e) {
				const file = e.target.files[0];
				const imgRef = ref(
					storage,
					`${this.userId}/${this.country}/${file.name + file.size}`
				);
				console.log(imgRef);
				// const uploadFile = await uploadBytes(imgRef, file);
				// console.log(uploadFile.ref);
				// const getUrl = await getDownloadURL(uploadFile.ref).then(
				// 	(downloadURL) => {
				// 		//console.log("File available at", downloadURL);
				// 		return downloadURL;
				// 	}
				// );
				// console.log(getUrl);
				const uploadTask = await uploadBytesResumable(imgRef, file);
				//const uploadTask = uploadBytesResumable(imgRef, file);
				//const UrlFile = await uploadTask.on("state_changed", () => {
				//const urlFile = uploadTask.on("state_changed", () => {
				//const test = await getDownloadURL(uploadTask.ref);
				this.urlImg = await getDownloadURL(uploadTask.ref);

				// .then(
				// 	(downloadURL) => {
				// 		console.log("File available at", downloadURL);
				//this.$store.commit("SAVE_CURRENT_PHOTOS", downloadURL);
				//this.$store.commit("SAVE_IMGS", downloadURL);
				// 	}
				// );
				console.log(this.urlImg);
				//});
				//const UrlFile = await getDownloadURL(uploadTask);
				//console.log(urlFile);
			},
			addImage() {
				this.addedPhotos.map((photo) => {
					const photosRef = photo.name + photo.size;
					this.$store.commit("SAVE_IMGS", photosRef);
					const imgRef = ref(
						storage,
						`${this.userId}/${this.country}/${photo.name + photo.size}`
					);

					uploadBytesResumable(imgRef, photo);
				});
				// return new Promise((resolve, reject) => {
				// 	if (this.addedPhotos.length > 0) {
				// 		this.addedPhotos.map((photo) => {
				// 			//console.log(photo);
				// 			//const photosRef = photo.name + photo.size;
				// 			//this.$store.commit("SAVE_CURRENT_PHOTOS", photosRef);
				// 			const imgRef = ref(
				// 				storage,
				// 				`${this.userId}/${this.country}/${photo.name + photo.size}`
				// 			);
				// 			const uploadTask = uploadBytesResumable(imgRef, photo);
				// 			uploadTask.on(
				// 				"state_changed",
				// 				(snapshot) => {
				// 					// Observe state change events such as progress, pause, and resume
				// 					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				// 					const progress =
				// 						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				// 					console.log("Upload is " + progress + "% done");
				// 					switch (snapshot.state) {
				// 						case "paused":
				// 							console.log("Upload is paused");
				// 							break;
				// 						case "running":
				// 							console.log("Upload is running");
				// 							break;
				// 					}
				// 				},
				// 				(error) => {
				// 					// Handle unsuccessful uploads
				// 					console.log(error);
				// 				},
				// 				() => {
				// 					//Handle successful uploads on complete
				// 					//For instance, get the download URL: https://firebasestorage.googleapis.com/...
				// 					getDownloadURL(uploadTask.snapshot.ref).then(
				// 						(downloadURL) => {
				// 							console.log("File available at", downloadURL);
				// 							//this.$store.commit("SAVE_CURRENT_PHOTOS", downloadURL);
				// 							this.$store.commit("SAVE_IMGS", downloadURL);
				// 							resolve(downloadURL);
				// 						}
				// 					);
				// 					//});
				// 				}
				// 			);
				// 			//resolve(uploadTask);
				// 		});
				// 	} else {
				// 		reject("tableau vide");
				// 	}
				// 	console.log(this.currentPhotosUrl);
				// });
			},
			async addNote() {
				console.log(
					this.country,
					this.note,
					this.location,
					this.user,
					this.region,
					this.urlImg
				);
				//Add a new document with a generated id.
				const docRef = await addDoc(collection(db, "notes"), {
					content: this.note,
					country: this.country,
					location: this.location,
					userId: this.user,
					region: this.region,
					photosUrl: this.allImgUrl,
				});
				console.log("Document written with ID: ", docRef.id);
			},
			async saveNote() {
				await this.multipleFile();
				await this.addNote();

				//clear everything after saving note to database
				this.note = "";
				this.location = "";
				this.addedPhotos = [];
				this.allImgUrl = [];
				this.$store.commit("SAVE_CURRENT_PHOTOS");

				this.displayModal();
			},
			getUserId() {
				onAuthStateChanged(auth, (user) => {
					if (user) {
						// User is signed in, see docs for a list of available properties
						// https://firebase.google.com/docs/reference/js/firebase.User
						const uid = user.uid;
						this.user = user.uid;
						console.log(uid);
						//console.log(storageRef);
					} else {
						// User is signed out
						console.log("user out");
					}
				});
			},
		},
		beforeMount() {
			this.getUserId();
		},
	};
</script>

<style scoped>
	.active__modal {
		cursor: pointer;
	}
	.modal {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.2);
		z-index: 100;
	}
	.form__container {
		position: relative;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50vw;
		height: 60vh;
		background: #546a7b;
		border-radius: 5em;
	}
	.form__add {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70%;
	}
	.form__control {
		width: 100%;
		margin: 1em 0;
	}
	.form__control input,
	.form__control textarea {
		width: 100%;
	}
	input {
		border: none;
		border-bottom: solid 1px;
		background: #546a7b;
		padding: 0.2em 0;
		font-size: 2em;
	}
	input:focus {
		outline: none;
		background: #dddde3;
	}
	input::placeholder {
		color: #000;
	}
	textarea {
		font-size: 1.5em;
		height: 5em;
		background: #546a7b;
		border: solid 1px black;
	}
	textarea::placeholder {
		color: #000;
	}
	textarea:focus {
		outline: none;
		background: #dddde3;
	}
	.form__label {
		text-align: left;
		font-size: 2em;
		color: #000;
	}
	button {
		all: unset;
		border: none;
		background: #0d1f2d;
		font-size: 1.2em;
		padding: 0.5em;
		color: #fff;
	}
	#add__btn {
		text-align: right;
	}
	#form_img {
		color: #000;
	}
	@media (max-width: 600px) {
		.form__container {
			width: 90vw;
		}
	}

	@media (min-width: 601px) and (max-width: 768px) {
		.form__container {
			width: 70vw;
		}
	}
	@media (max-width: 768px) {
		.form__container {
			border-radius: 3em;
		}
		.form__control input {
			font-size: 1em;
		}
		.form__label,
		textarea {
			font-size: 1.2em;
		}
		.note__container {
			width: 90vw;
		}
	}
</style>
