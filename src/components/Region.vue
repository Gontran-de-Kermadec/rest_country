<template>
	<div>
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
			getRegionFromApi() {
				axios
					.get(`https://restcountries.com/v3.1/region/${this.region}`)
					.then((response) => {
						// handle success
						this.sortCountries(response.data);
						this.allCountries = response.data;
					})
					.catch((error) => {
						// handle error
						console.log(error);
					});
			},
			getTarget(e) {
				this.singleCountry = e.target.innerText;
				console.log(this.singleCountry);
			},
			sortCountries(arr) {
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
		box-shadow: 1px 6px 6px 4px;
		border-radius: 1em;
	}
	.region__country a {
		text-decoration: none;
	}
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
