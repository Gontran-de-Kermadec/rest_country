<template>
	<!-- <div>{{ $route.params.region }}</div> -->
	<div>
		<!-- <p>{{ regionEnglish }}</p> -->
		<h1>{{ $route.params.region }}</h1>
		<div class="region__container">
			<div
				v-for="country in allCountries"
				:key="country.area"
				class="region__country"
			>
				<div class="img__container">
					<img :src="country.flags.png" alt="drapeau d'un pays" />
				</div>
				<router-link
					:to="{
						name: 'Country',
						params: {
							region: region,
							country: singleCountry,
							//englishCountry: country.name.common,
						},
					}"
				>
					<p @click="getTarget">
						{{ country.name.common }}
					</p>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	const axios = require("axios");
	export default {
		name: "Region",
		data() {
			return {
				region: this.$route.params.region,
				regionEnglish: "",
				allCountries: [],
				sortedCountries: [],
				singleCountry: "France",
			};
		},
		methods: {
			// translateRegion: function (region) {
			// 	switch (region) {
			// 		case "Afrique":
			// 			this.regionEnglish = "Africa";
			// 			break;
			// 		case "Amérique":
			// 			this.regionEnglish = "Americas";
			// 			break;
			// 		case "Asie":
			// 			this.regionEnglish = "Asia";
			// 			break;
			// 		case "Europe":
			// 			this.regionEnglish = "Europe";
			// 			break;
			// 		case "Océanie":
			// 			this.regionEnglish = "Oceania";
			// 			break;
			// 		default:
			// 			console.log("failed");
			// 	}
			// },
			getRegionFromApi() {
				console.log(this.regionEnglish);
				axios
					.get(`https://restcountries.com/v3.1/region/${this.region}`)
					.then((response) => {
						// handle success
						//console.log(response.data);
						this.sortCountries(response.data);
						this.allCountries = response.data;
					})
					.catch((error) => {
						// handle error
						console.log(error);
					});
			},
			getTarget(e) {
				//console.log(e.target.child);
				this.singleCountry = e.target.innerText;
				console.log(this.singleCountry);
			},
			sortCountries(arr) {
				//this.sortedCountries = this.allCountries.sort(function compare(a, b) {
				arr.sort(function compare(a, b) {
					if (a.name.common < b.name.common) return -1;
					if (a.name.common > b.name.common) return 1;
					return 0;
				});
				console.log(arr);
			},
		},
		beforeMount() {
			//this.translateRegion(this.$route.params.region);
			//this.sortCountries();
		},
		mounted() {
			this.getRegionFromApi();
		},
	};
</script>

<style scoped>
	.region__container {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}
	.region__country {
		margin: 2em;
		/* border: solid; */
		box-shadow: 1px 6px 6px 4px;
		border-radius: 1em;
		/* padding: 2em; */
	}
	.region__country a {
		text-decoration: none;
	}
	/* .region__country a p {
		pointer-events: none;
	} */
	.img__container {
		height: 13em;
		width: 13em;
	}
	.img__container img {
		height: 100%;
		width: 100%;
		border-radius: 1em 1em 0 0;
	}
</style>
