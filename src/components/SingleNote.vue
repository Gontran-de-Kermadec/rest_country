<template>
	<div v-if="notes.length > 0" class="all__notes--container">
		<div
			v-for="note in notes"
			:key="note.id"
			:data-note-id="note.id"
			class="note__container"
			:id="note.id"
		>
			<div v-if="note.photosUrl.length > 0" class="note__container--flex">
				<div class="note__img">
					<div class="note__img--zoom" @click="show(note.photosUrl[0])">
						<!-- <div class="note__img--zoom" @click="show(0, note.photosUrl[0])"> -->
						<p>ZOOM</p>
					</div>
					<img :src="note.photosUrl[0]" :alt="note.location" />
				</div>
				<div class="note__text">
					<div class="note__location">
						<h3>{{ note.location }}</h3>
						<button @click="deleteNote" :data-note-id="note.id">
							Delete note
						</button>
					</div>
					<div class="note__line"></div>
					<div class="note__content">
						<p>{{ note.content }}</p>
					</div>
				</div>
			</div>
			<div v-else class="note__onlytext">
				<div class="note__text note__text--width">
					<div class="note__location">
						<h3>{{ note.location }}</h3>
						<button @click="deleteNote" :data-note-id="note.id">
							Delete note
						</button>
					</div>
					<div class="note__line"></div>
					<div class="note__content">
						<p>{{ note.content }}</p>
					</div>
				</div>
			</div>
		</div>
		<div v-if="modalOn" class="modal" @click.self="displayModal" tabindex="0">
			<button @click="prevImg">Prev</button>
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
			<button @click="nextImg">Next</button>
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
			displayModal(e) {
				console.log(e.target);
				this.modalOn = !this.modalOn;
				document.body.classList.toggle("body__hidden");
			},
			// show(index, url) {
			// 	this.notesImgs(url);
			// 	this.src = url;
			// 	this.modalOn = !this.modalOn;
			// 	document.body.classList.toggle("body__hidden");
			// },
			show(url) {
				this.notesImgs(url);
				this.src = url;
				this.modalOn = !this.modalOn;
				document.body.classList.toggle("body__hidden");
			},
			notesImgs(url) {
				this.notes.forEach((note) => {
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
			},
			nextImg() {
				if (this.index === this.noteImg.length - 1) {
					this.index = 0;
				} else {
					this.index = this.index + 1;
				}
			},
			async deleteNote(e) {
				const noteId = e.target.dataset.noteId;
				//delete from storage thanks to name of file
				const docRef = doc(db, "notes", noteId);
				const docSnap = await getDoc(docRef);
				const urlRef = docSnap.data().photosUrl;
				for (let element of urlRef) {
					const fileRef = ref(storage, element);
					deleteObject(fileRef)
						.then(() => {
							// File deleted successfully
						})
						.catch((error) => {
							console.log(error);
						});
				}
				//delete from firestore thanks to id of document
				await deleteDoc(doc(db, "notes", noteId));
			},
		},
	};
</script>

<style scoped>
	body {
		background: pink;
	}
	.note__container {
		width: 60vw;
		margin: 4em auto;
		border: solid;
	}
	.note__container--flex {
		display: flex;
		justify-content: space-between;
		height: 50vh;
	}

	.note__img {
		width: 100%;
		position: relative;
		border: solid 10px #dddde3;
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
		width: 100%;
	}
	.note__text--width {
		width: 100%;
	}
	.note__location {
		position: relative;
		z-index: 10;
		padding: 1em 0;
	}
	.note__line {
		border: solid 1px;
		width: 50%;
		margin: 0 auto;
		background: #000;
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
		background: #dddde3;
		position: absolute;
		right: -2px;
		top: -56px;
	}
	.note__content {
		overflow: hidden;
		padding: 1em;
	}
	.note__onlytext .note__line {
		width: 100%;
	}
	.note__onlytext .note__content {
		padding: 3em;
	}
	.modal {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(221, 221, 227, 0.7);
		z-index: 20;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal--posabsolute {
		position: absolute;
	}
	.modal__img img {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}
	.modal__img > .image__active {
		height: 85vh;
		width: 60vw;
	}
	.modal__img > .image__inactive {
		display: none;
	}
	.modal button {
		all: unset;
		background: #0d1f2d;
		padding: 1em;
		color: white;
		cursor: pointer;
	}
</style>
