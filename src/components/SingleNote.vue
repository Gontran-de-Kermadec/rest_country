<template>
	<div v-if="notes.length > 0" class="all__notes--container">
		<!-- <div
			v-for="note in notes"
			:key="note.id"
			class="note__container"
			:data-note-id="note.id"
		>
			<div v-if="note.photosUrl !== ''" class="note__img">
				<img :src="note.photosUrl" alt="#" />
			</div>
			<div v-else></div>
			<div class="note__text">
				<div class="note__location">
					<h3>{{ note.location }}</h3>
					<button @click="deleteNote">Delete</button>
				</div>
				<div class="note__content">
					<div>
						<p>{{ note.content }}</p>
					</div>
				</div>
			</div>
		</div> -->

		<div
			v-for="note in notes"
			:key="note.id"
			:data-note-id="note.id"
			class="note__container"
		>
			<!-- <div class="note__container" v-if="note.photosUrl !== ''"> -->
			<div class="note__location">
				<h3>{{ note.location }}</h3>
				<button @click="deleteNote" :data-note-id="note.id">Delete note</button>
			</div>
			<div class="note__container--flex" v-if="note.photosUrl.length !== 0">
				<!-- <div class="note__img">
					<img :src="note.photosUrl" alt="#" />
				</div> -->
				<div class="note__img">
					<div class="note__img--zoom" @click="show(0, note.photosUrl[0])">
						<p>ZOOM</p>
					</div>
					<img :src="note.photosUrl[0]" :alt="note.location" />
				</div>
				<div class="note__text">
					<!-- <div class="note__location">
						<h3>{{ note.location }}</h3>
						<button @click="deleteNote">Delete</button>
					</div> -->
					<div class="note__content">
						<p>{{ note.content }}</p>
					</div>
				</div>
			</div>
			<div v-else class="note__container">
				<div class="note__text note__text--width">
					<div class="note__location">
						<h3>{{ note.location }}</h3>
						<button @click="deleteNote" :data-note-id="note.id">
							Delete note
						</button>
					</div>
					<div class="note__content">
						<div>
							<p>{{ note.content }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			v-if="modalOn"
			class="modal"
			@click.self="displayModal"
			@keyup.esc="test"
			tabindex="0"
		>
			<!-- <div class="modal--posabsolute"> -->
			<p @click="prevImg">prec</p>
			<div
				v-for="(photo, i) in noteImg"
				:key="i"
				class="modal__img"
				:class="classImg"
			>
				<div v-if="index === i" class="image__active">
					<img :src="photo" alt="" />
				</div>
				<div v-else class="image__inactive">
					<img :src="photo" alt="" />
				</div>
			</div>
			<button @click="nextImg">suiv</button>
			<!-- </div> -->
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import { getFirestore, getDoc, doc, deleteDoc } from "firebase/firestore";
	import { getStorage, ref, deleteObject } from "firebase/storage";
	const storage = getStorage();
	const db = getFirestore();
	export default {
		name: "SingleNote",
		data() {
			return {
				modalOn: false,
				index: -1,
				src: "",
				noteImg: [],
				classImg: "",
				scrollBody: "visible",
			};
		},
		computed: mapState({
			notes: (state) => state.notes,
		}),
		methods: {
			test() {
				console.log("ddjdjdj");
			},
			displayModal(e) {
				console.log(e.target);
				this.modalOn = !this.modalOn;
				document.body.classList.toggle("body__hidden");
			},
			show(index, url) {
				this.notesImgs(url);
				console.log(this.notesImgs);
				this.src = url;
				console.log(index, url);
				this.modalOn = !this.modalOn;
				document.body.classList.toggle("body__hidden");
			},
			notesImgs(url) {
				console.log(this.notes);
				//if(url === )
				// for (let i = 0; i <= this.notes.length; i++) {
				// 	console.log(this.notes[i]);
				// 	const element = this.notes[i].photosUrl.find((el) => el === url);
				// 	console.log(element);
				// 	if (element === "undefined") {
				// 		console.log("mauvais array");
				// 	} else {
				// 		console.log(this.notes[i]);
				// 	}
				// }
				// this.notes.map((note) => {
				// 	const element = note.photosUrl.find((el) => el === url);
				// 	if (element !== "undefined") {
				// 		console.log(note.photosUrl);
				// 	}
				// 	//console.log(element);
				// });
				this.notes.forEach((note) => {
					//const element =
					if (note.photosUrl.length > 0) {
						note.photosUrl.find((el, index, arr) => {
							if (el === url) {
								console.log(arr, index);
								this.index = index;
								this.noteImg = [...note.photosUrl];
							}
						});
					}
				});
				console.log(this.noteImg);
			},
			dispayRightImg() {
				for (let i = 0; i < this.noteImg.length; i++) {
					if (this.index === i) {
						console.log(i, "image active");
						this.classImg = "active";
					} else {
						console.log("image inactive");
						this.classImg = "";
					}
				}
			},
			prevImg() {
				const long = this.noteImg.length;
				if (this.index === 0) {
					this.index = long - 1;
				} else {
					this.index = this.index - 1;
				}
				console.log(this.index);
			},
			nextImg() {
				if (this.index === this.noteImg.length - 1) {
					this.index = 0;
				} else {
					this.index = this.index + 1;
				}
				console.log(this.index);
			},
			async deleteNote(e) {
				console.log(this.noteImg);
				const noteId = e.target.dataset.noteId;

				//delete from storage thanks to name of file
				const docRef = doc(db, "notes", noteId);
				const docSnap = await getDoc(docRef);
				console.log(docSnap.data().photosUrl);
				const urlRef = docSnap.data().photosUrl;
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
				//delete from firestore thanks to id of document
				await deleteDoc(doc(db, "notes", noteId));
			},
		},
		mounted() {
			//this.changeBody()
			//document.body.classList.add("visible");
		},
	};
</script>

<style scoped>
	body {
		background: pink;
	}
	/* .all__notes--container {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	} */
	.note__container {
		width: 80vw;
		margin: 1em auto;
		border: solid;
		/* max-height: 35vh; */
	}
	.note__container--flex {
		display: flex;
		justify-content: space-between;
		/* border: solid; */
		height: 35vh;
		/* width: 80vw;
		margin: 1em auto;
		max-height: 35vh; */
	}

	.note__img {
		width: 30%;
		position: relative;
	}
	.note__img:hover .note__img--zoom {
		opacity: 1;
		transition: all 0.5s;
	}
	.note__img--zoom {
		opacity: 1;
		position: absolute;
		top: 0;
		color: #000;
		background: #fff;
		margin: 0.5em;
		transition: all 0.5s;
		cursor: pointer;
		border-radius: 0.5em;
	}
	.note__img--zoom p {
		padding: 0.5em;
	}
	.note__img img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	.note__text {
		width: 70%;
	}
	.note__text--width {
		width: 100%;
	}
	.note__location {
		/* border: solid; */
		border-bottom: solid 1px;
		background: pink;
		position: relative;
		z-index: 10;
	}
	.note__location h3 {
		margin: 0;
		padding: 0.5em;
	}
	.note__location button {
		all: unset;
		cursor: pointer;
		margin: 1em 0;
		border: solid;
		padding: 0.5em 1em;
		background: lightyellow;
		position: absolute;
		right: -2px;
		top: -56px;
		/* transform: translateY(-50%); */
	}
	.note__content {
		overflow: hidden;
		padding: 1em;
	}
	.modal {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: lightblue;
		z-index: 20;
	}
	.modal--posabsolute {
		position: absolute;
	}
	.modal__img {
		width: 60vw;
		margin: auto;
	}
	.modal__img img {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}
	.image__active {
		/* width: 60vw;
		margin: auto; */
		height: 80vh;
	}
	.image__inactive {
		display: none;
	}
</style>
