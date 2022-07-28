<template>
	<div class="searchbar__container">
		<label for="searchbar">Rechercher un pays</label>
		<div class="searchbar__input">
			<input
				type="search"
				id="searchbar"
				name="searchbar"
				placeholder="Ex: Ghana"
				v-model="query"
				@keyup="filterResult"
				@focus="displayResults = true"
				@blur="displayResults = false"
			/>
			<div class="absolute" v-if="query.length > 1">
				<div
					class="result"
					v-for="country in filteredResult"
					:key="country.area"
				>
					<router-link
						:to="{
							name: 'Country',
							params: { region: country.region, country: country.name.common },
						}"
					>
						<div class="img__container">
							<img :src="country.flags.png" class="content" />
						</div>
						<p class="name">{{ country.name.common }}</p>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const axios = require("axios");
	export default {
		name: "SearchBar",
		data() {
			return {
				query: "",
				allCountries: [],
				filteredResult: [],
				displayResults: false,
			};
		},
		methods: {
			getAllCountries() {
				axios
					.get("https://restcountries.com/v3.1/all")
					.then((response) => {
						// handle success
						this.allCountries = response.data;
					})
					.catch((error) => {
						// handle error
						console.log(error);
					});
			},
			//fonction qui permet d'effectuer un filtre avec la barre de recherche
			filterResult() {
				if (this.query.length > 0) {
					console.log(this.allCountries[0].name);
					const filteredArray = this.allCountries.filter((country) => {
						const countryName = country.name.common.toLowerCase();
						return countryName.includes(this.query);
					});
					if (filteredArray.length > 5) {
						this.filteredResult = filteredArray.slice(0, 5);
					} else {
						this.filteredResult = filteredArray;
					}
				}
			},
		},
		mounted() {
			this.getAllCountries();
		},
	};
</script>

<style scoped>
	.searchbar__container {
		text-align: left;
		margin: 2em 0;
	}
	label {
		margin: 0 1em;
	}
	.searchbar__input {
		display: inline-block;
		position: relative;
		width: 35vw;
	}
	input {
		width: 100%;
		height: 3em;
		border: none;
		border-bottom: solid 1px;
	}
	input:focus {
		outline: none;
	}
	.absolute {
		position: absolute;
		width: 100%;
		background: white;
	}
	.result {
		padding: 0.2em 0;
	}
	.result:hover {
		background: #dddde3;
		transition: background 0.5s;
	}
	.result a {
		display: flex;
		text-decoration: none;
		color: black;
		margin: 0.5em 0 0.5em 0.5em;
	}
	.result a p {
		margin: 0 0 0 1em;
		align-self: center;
	}
	.img__container {
		width: 5em;
		height: 3em;
		box-shadow: 2px 3px 1px 0px;
		margin-right: 1em;
	}
	.img__container img {
		width: 100%;
		height: 100%;
	}
	@media (max-width: 768px) {
		.searchbar__container {
			display: flex;
			flex-direction: column;
			text-align: center;
		}
		.searchbar__input {
			width: 80vw;
			margin: 0.3em auto;
		}
	}
</style>
