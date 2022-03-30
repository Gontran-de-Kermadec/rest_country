<template>
	<div>
		<button @click="displayModal" class="active__modal">Add Image</button>
		<div v-if="modalOn" class="modal" @click.self="displayModal">
			<div class="form__container">
				<form class="form__add">
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
						<button @click.prevent="saveImagesToFirebase">Add Image(s)</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	// import "../firebaseConfig";
	//import { getAuth, onAuthStateChanged } from "firebase/auth";
	//@ts-ignoreimport { getFirestore, collection, addDoc } from "firebase/firestore";
	import {
		getStorage,
		ref,
		uploadBytesResumable,
		getDownloadURL,
	} from "firebase/storage";
	//import { getDatabase, ref, onValue } from "firebase/database";
	import {
		getFirestore,
		//doc,
		// updateDoc,
		//setDoc,
		where,
		collection,
		addDoc,
		query,
		getDocs,
		// onSnapshot,
	} from "firebase/firestore";
	const db = getFirestore();
	//const auth = getAuth();
	const storage = getStorage();
	export default {
		name: "AddImage",
		data() {
			return {
				modalOn: false,
				//country: this.selectedCountry,
				note: "",
				location: "",
				user: "",
				photos: [],
				docId: "",
			};
		},
		computed: mapState({
			userId: (state) => state.userId,
			country: (state) => state.currentCountry,
			photosUrl: (state) => state.photosUrl,
			imgsUrl: (state) => state.imgsUrl,
			currentPhotosUrl: (state) => state.currentPhotosUrl,
		}),
		methods: {
			displayModal() {
				this.modalOn = !this.modalOn;
				//console.log("click");
			},
			getImgName(e) {
				console.log(e.target.files);
				for (let i = 0; i < e.target.files.length; i++) {
					this.photos.push(e.target.files[i]);
				}
			},
			async saveImagesToFirebase() {
				try {
					console.log("avant fucntion");
					const stored = await this.saveImageToStorage();
					console.log(stored);
					await this.saveImgUrlToFirestore();
				} catch (err) {
					console.log(err);
				}

				this.photos = [];
				this.$store.commit("SAVE_CURRENT_PHOTOS");
				this.displayModal();
			},
			saveImageToStorage() {
				//return
				return new Promise((resolve, reject) => {
					this.photos.map((photo) => {
						console.log(photo);
						const imgRef = ref(
							storage,
							`${this.userId}/${this.country}/${photo.name + photo.size}`
						);
						const uploadTask = uploadBytesResumable(imgRef, photo);
						// getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						// 	console.log("File available at", downloadURL);
						// })
						uploadTask.on(
							"state_changed",
							(snapshot) => {
								// Observe state change events such as progress, pause, and resume
								// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
								const progress =
									(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
								console.log("Upload is " + progress + "% done");
								// switch (snapshot.state) {
								// 	case "paused":
								// 		console.log("Upload is paused");
								// 		break;
								// 	case "running":
								// 		console.log("Upload is running");
								// 		break;
								// }
							},
							(error) => {
								console.log(error);
							},
							() => {
								// Handle successful uploads on complete
								getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
									console.log("File available at", downloadURL);
									//this.photosUrl.push(downloadURL);
									//add url tho the store
									//this.$store.commit("SAVE_CURRENT_PHOTOS", downloadURL);
									//this.checkFirestore();
									//this.saveToEmptyStore(this.currentPhotosUrl);
									this.$store.commit("SAVE_CURRENT_PHOTOS", downloadURL);
									console.log(this.currentPhotosUrl);
									//resolve("bien envoyé");
								});
							}
						);
						resolve(uploadTask);
					});
					reject("erreur");
				});

				// this.photos = [];
				// this.$store.commit("SAVE_CURRENT_PHOTOS");
				// this.displayModal();
				//this.saveImgUrlToFirestore();
			},
			async checkFirestore() {
				const querySnapshot = await getDocs(collection(db, "imgUrl"));
				querySnapshot.forEach((doc) => {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
					if (doc.id) {
						const request = query(
							collection(db, "imgUrl"),
							where("country", "==", this.country),
							where("userId", "==", this.userId)
						);
						console.log(request);
					}
				});
			},
			// async saveImage() {
			// 	this.photos.map((photo) => {
			// 		console.log(photo);
			// 		const imgRef = ref(
			// 			storage,
			// 			`${this.userId}/${this.country}/${photo.name + photo.size}`
			// 		);
			// 		//console.log(imgRef);
			// 		const uploadTask = uploadBytesResumable(imgRef, photo);
			// 		uploadTask.on(
			// 			"state_changed",
			// 			(snapshot) => {
			// 				// Observe state change events such as progress, pause, and resume
			// 				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			// 				const progress =
			// 					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			// 				console.log("Upload is " + progress + "% done");
			// 				// switch (snapshot.state) {
			// 				// 	case "paused":
			// 				// 		console.log("Upload is paused");
			// 				// 		break;
			// 				// 	case "running":
			// 				// 		console.log("Upload is running");
			// 				// 		break;
			// 				// }
			// 			},
			// 			(error) => {
			// 				console.log(error);
			// 			},
			// 			() => {
			// 				// Handle successful uploads on complete
			// 				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
			// 				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
			// 					console.log("File available at", downloadURL);
			// 					//this.photosUrl.push(downloadURL);
			// 					//add url tho the store
			// 					this.$store.commit("SAVE_PHOTOS", downloadURL);
			// 					console.log(this.photosUrl);
			// 				});
			// 			}
			// 		);
			// 	});
			// 	this.saveImgUrl();

			// 	//clear everything after saving note to database
			// 	this.photos = [];

			// 	this.displayModal();
			// },
			async saveToEmptyStore(photos) {
				//const docRef =
				await addDoc(collection(db, "imgUrl"), {
					userId: this.userId,
					country: this.country,
					imgsUrl: photos,
				});
			},
			async saveImgUrlToFirestore() {
				//console.log(this.imgsUrl);
				console.log(this.userId, this.currentPhotosUrl);
				const docRef = await addDoc(collection(db, "imgUrl"), {
					userId: this.userId,
					country: this.country,
					imgsUrl: this.currentPhotosUrl,
				});
				console.log(docRef.id);

				// if (this.imgsUrl.length === 0) {
				// 	const docRef = await addDoc(collection(db, "imgUrl"), {
				// 		userId: this.userId,
				// 		country: this.country,
				// 		imgsUrl: this.photosUrl,
				// 	});
				// 	console.log(docRef.id);
				// } else {
				// 	const request = query(
				// 		collection(db, "imgUrl"),
				// 		where("country", "==", this.country),
				// 		where("userId", "==", this.userId)
				// 	);
				// 	console.log(request);
				// 	const result = await getDocs(request);
				// 	console.log(result);
				// 	onSnapshot(result.query, (snapShot) => {
				// 		console.log(snapShot);
				// 		snapShot.forEach((doc) => {
				// 			console.log(doc.data().imgsUrl);
				// 			this.docId = doc.id;
				// 		});
				// 		// snapShot.forEach((doc) => {
				// 		// });
				// 	});
				// 	console.log(this.imgsUrl, this.photosUrl);
				// 	//update doc
				// 	//const docReference = doc(db, "imgUrl", this.docId);
				// 	// Set the "capital" field of the city 'DC'
				// 	// await updateDoc(docReference, {
				// 	// imgsUrl: this.photosUrl
				// 	// });
				// }
				// this.$store.commit("SAVE_PHOTOS");
			},
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
		/* transform: translate(-50%, -50%); */
		background: rgba(0, 0, 0, 0.2);
	}
	.form__container {
		position: relative;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50vw;
		height: 60vh;
		background: #708122;
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
		background: #708122;
		/* height: 3em; */
		padding: 0.2em 0;
		font-size: 2em;
	}
	input:focus {
		outline: none;
		background: #efdd8d;
	}
	input::placeholder {
		color: #000;
	}
	textarea {
		font-size: 1.5em;
		height: 5em;
		background: #708122;
		border: solid 1px black;
	}
	textarea::placeholder {
		color: #000;
	}
	textarea:focus {
		outline: none;
		background: #efdd8d;
	}
	.form__label {
		text-align: left;
		font-size: 2em;
		color: #000;
	}
	button {
		all: unset;
		border: none;
		background: #efdd8d;
		font-size: 1.2em;
		padding: 0.5em;
	}
	#add__btn {
		text-align: right;
	}
</style>
