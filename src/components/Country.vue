<template>
	<div>
		<!-- <p>{{ englishCountry }}</p> -->
		<!-- <p>{{ frenchCountry }}</p> -->
		<div v-for="data in datas" :key="data.area">
			<div>
				<router-link :to="{ name: 'Region', params: { region: data.region } }"
					>Back</router-link
				>
				<h1>{{ data.name.common }}</h1>
			</div>
			<img :src="data.flags.png" />
			<div>
				<a :href="data.maps.googleMaps" target="_blank"
					>Have a look on Google Maps</a
				>
			</div>
			<div class="country__infos">
				<div>
					<p>Coat of arms:</p>
					<div class="img__container">
						<img :src="data.coatOfArms.png" />
					</div>
				</div>
				<div>
					<p>Capital :</p>
					<p>
						{{ data.capital[0] }}
					</p>
				</div>
				<div>
					<p>Population :</p>
					<p>
						{{ data.population }}
					</p>
				</div>
				<div>
					<p v-if="languages.length > 1">Langues:</p>
					<p v-else>Langue :</p>
					<p v-for="language in languages" :key="language">{{ language }}</p>
					<!-- {{ data.languages.eng }} -->
				</div>
				<div>
					<p>UN Member:</p>
					<p v-if="data.unMember">Yes</p>
					<p v-else>No</p>
				</div>
				<div>
					<p>Area:</p>
					<p>{{ data.area }}km²</p>
				</div>
			</div>
			<!-- <p @click="getCurrencyCode">click</p> -->
		</div>
		<h2>Development in progress...</h2>
	</div>
</template>

<script>
	const axios = require("axios");
	export default {
		name: "Country",
		data() {
			return {
				englishCountry: this.$route.params.country,
				//population: null,
				//frenchCountry: null,
				datas: [],
				languages: [],
			};
		},
		methods: {
			// logParams() {
			// 	console.log(this.$route.params);
			// },
			getRegionFromApi() {
				//console.log(this.regionEnglish);
				axios
					.get(
						`https://restcountries.com/v3.1/name/${this.englishCountry}?fullText=true`
					)
					.then((response) => {
						// handle success
						console.log(response.data);
						this.datas = response.data;
						//this.getCurrencyCode(this.datas);
						this.getCurrencyCode();
					})
					.catch((error) => {
						// handle error
						console.log(error);
					});
			},
			getCurrencyCode() {
				//let newArr = await this.datas;
				// let newArr = arr.map(({ languages }) => {
				// 	return languages;
				// });
				let newArr = this.datas.map(({ languages }) => {
					return languages;
				});
				//console.log(newArr);
				//console.log(Object.values(newArr[0]));
				this.languages = Object.values(newArr[0]);
				//console.log(this.languages);
			},
		},
		beforeMount() {
			this.getRegionFromApi();
		},
	};
</script>

<style scoped>
	.country__infos {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.img__container {
		width: 5em;
	}
	.img__container img {
		width: 100%;
	}
</style>
