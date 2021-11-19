<template>
	<div>
		<h1>Consulter les données du pays de votre choix</h1>
		<SearchBar />
		<!-- <h2>Seléctionner une région</h2> -->
		<div class="region__container">
			<div class="region__single">
				<router-link :to="{ name: 'Region', params: { region: region } }">
					<p @click="getTarget">Africa</p>
				</router-link>
			</div>
			<div class="region__single">
				<router-link :to="{ name: 'Region', params: { region: region } }">
					<p @click="getTarget">Americas</p>
				</router-link>
			</div>
			<div class="region__single">
				<router-link :to="{ name: 'Region', params: { region: region } }">
					<p @click="getTarget">Asia</p>
				</router-link>
			</div>
			<div class="region__single">
				<router-link :to="{ name: 'Region', params: { region: region } }">
					<p @click="getTarget">Europe</p>
				</router-link>
			</div>
			<div class="region__single">
				<router-link :to="{ name: 'Region', params: { region: region } }">
					<p @click="getTarget">Oceania</p>
				</router-link>
			</div>
		</div>

		<!-- <router-link :to="{ name: 'Region', params: { region: 'Afrique' } }">
			<p>Afrique</p>
		</router-link> -->
	</div>
</template>

<script>
	import SearchBar from "./SearchBar.vue";
	// const axios = require("axios");
	export default {
		name: "Homepage",
		components: {
			SearchBar,
		},
		data() {
			return {
				region: " ",
			};
		},
		methods: {
			// getApi() {
			// 	axios
			// 		.get("https://restcountries.com/v3.1/subregion/south")
			// 		.then(function (response) {
			// 			// handle success
			// 			console.log(response.data);
			// 		})
			// 		.catch(function (error) {
			// 			// handle error
			// 			console.log(error);
			// 		});
			// },
			getTarget(e) {
				console.log(e.target.innerText);
				this.region = e.target.innerText;
				console.log(this.region);
			},
		},
	};
</script>

<style scoped>
	.region__container {
		display: flex;
		/* justify-content: center; */
		/* flex-wrap: wrap; */
		height: 70vh;
	}
	/* a {
		text-decoration: none;
	} */
	.region__container .region__single {
		/* text-decoration: none; */
		display: flex;
		justify-content: center;
		border: solid white 1px;
		/* width: 25%; */
		height: 100%;
		/* height: 8em; */
		/* margin: 2rem; */
		/* border-radius: 2em; */
		background: chocolate;
		transition: all 1s;
		flex-grow: 1;
		/* flex-shrink: 2; */
	}
	.region__container .region__single:hover {
		background: orangered;
		flex-grow: 10;

		/* width: 50%; */
		transition: all 2s;
	}

	.region__container .region__single:hover p {
		font-size: 2.5em;
		transition: all 1s;
	}
	.region__container a {
		text-decoration: none;
		align-self: center;
		color: white;
	}
	.region__container p {
		/* font-size: 2.5em; */
		/* margin: 0 1em; */
		transition: all 1s;
	}
</style>
