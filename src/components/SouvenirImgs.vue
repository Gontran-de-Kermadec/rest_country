<template>
	<div>
		<h3>Images</h3>
		<AddImage />
		<div v-if="imgUrl.length > 0" class="imgs__gallery">
			<div v-for="(img, index) in imgUrl" :key="index">
				<div class="img__container">
					<button @click="deleteImg" :data-img-id="img">Delete</button>
					<img :src="img" alt="photo" />
				</div>
			</div>
		</div>
		<div v-else>
			<p>No images registered !!</p>
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import AddImage from "./AddImage.vue";
	import { getStorage, ref, deleteObject } from "firebase/storage";
	const storage = getStorage();
	export default {
		name: "SouvenirImgs",
		data() {
			return {};
		},
		computed: mapState({
			imgUrl: (state) => state.imgsUrl,
		}),
		methods: {
			deleteImg(e) {
				console.log(e.path[0].dataset.imgId);
				// Create a reference to the file to delete
				const desertRef = ref(storage, e.path[0].dataset.imgId);

				//Delete the file
				deleteObject(desertRef)
					.then(() => {
						// File deleted successfully
						console.log("succesfully del");
					})
					.catch(() => {
						// Uh-oh, an error occurred!
						console.log("error");
					});
			},
		},
		components: { AddImage },
	};
</script>

<style scoped>
	.imgs__gallery {
		display: flex;
		justify-content: space-around;
		margin: 2em;
	}
	.img__container {
		width: 22em;
		height: 22em;
	}
	.img__container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
