<template>
	<div>
		<div v-for="data in datas" :key="data.area">
			<div class="country__header">
				<Header_button
					left-button-id="Homepage"
					right-button-id="continent"
					:region="data.region"
				/>
				<h1>{{ data.name.common }}</h1>
			</div>
			<img :src="data.flags.png" class="country__flag" />
			<div>
				<a :href="data.maps.googleMaps" target="_blank"
					>Have a look on Google Maps</a
				>
			</div>
			<div class="country__infos">
				<div>
					<h3>Coat of arms:</h3>
					<div class="img__container">
						<img :src="data.coatOfArms.png" />
					</div>
				</div>
				<div>
					<h3>Capital :</h3>
					<p>
						{{ data.capital[0] }}
					</p>
				</div>
				<div>
					<h3>Population :</h3>
					<p>
						{{ data.population }}
					</p>
				</div>
				<div>
					<h3 v-if="languages.length > 1">Languages:</h3>
					<h3 v-else>Language :</h3>
					<p v-for="language in languages" :key="language">{{ language }}</p>
					<!-- {{ data.languages.eng }} -->
				</div>
				<div>
					<h3>UN Member:</h3>
					<p v-if="data.unMember">Yes</p>
					<p v-else>No</p>
				</div>
				<div>
					<h3>Area:</h3>
					<p>{{ data.area }}km²</p>
				</div>
			</div>
		</div>
		<div v-if="isDataLoaded" class="personal__section">
			<Notes />
		</div>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	import "../firebaseConfig";
	//import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
	//import { getFirestore, collection, getDocs } from "firebase/firestore";
	// const db = getFirestore();
	// const auth = getAuth();
	const axios = require("axios");
	import Notes from "./Notes.vue";
	import Header_button from "./small_components/Header_button.vue";
	export default {
		name: "Country",
		data() {
			return {
				englishCountry: this.$route.params.country,
				datas: [],
				languages: [],
				mouseOverContinent: "",
				mouseOutContinent: "",
				mouseOverHome: "",
				mouseOutHome: "",
				isDataLoaded: false,
			};
		},
		computed: mapState({
			userId: (state) => state.userId,
			country: (state) => state.currentCountry,
		}),
		methods: {
			setCurrentCountry() {
				this.$store.commit("GET_CURRENT_COUNTRY", this.$route.params.country);
			},
			// isConnected() {
			// 	onAuthStateChanged(auth, (user) => {
			// 		if (user) {
			// 			// User is signed in, see docs for a list of available properties
			// 			// https://firebase.google.com/docs/reference/js/firebase.User
			// 			const uid = user.uid;
			// 			this.$store.commit("GET_USER_ID", {
			// 				userId: uid,
			// 			});
			// 			console.log(uid);
			// 			this.isLogged = true;
			// 			this.getNotes();
			// 		} else {
			// 			// User is signed out
			// 			console.log("user out");
			// 			this.isLogged = false;
			// 		}
			// 	});
			// },
			getRegionFromApi() {
				console.log(this.country);
				axios
					.get(
						`https://restcountries.com/v3.1/name/${this.country}?fullText=true`
					)
					.then((response) => {
						// handle success
						console.log(response.data);
						this.datas = response.data;
						//console.log(this.datas[0].region);
						this.$store.commit("GET_CURRENT_REGION", this.datas[0].region);
						//this.getCurrencyCode(this.datas);
						this.getCurrencyCode();
						this.isDataLoaded = true;
					})
					.catch((error) => {
						// handle error
						console.log(error);
					});
			},
			getCurrencyCode() {
				let newArr = this.datas.map(({ languages }) => {
					return languages;
				});
				this.languages = Object.values(newArr[0]);
			},
			// getAirQuality() {
			// 	axios
			// 		.get(
			// 			"http://api.airvisual.com/v2/nearest_city?key=c10ca4f7-42c8-4b2f-812f-d04c85aef002",
			// 			// "http://api.airvisual.com/v2/countries?key=c10ca4f7-42c8-4b2f-812f-d04c85aef002",
			// 			{
			// 				headers: {},
			// 			}
			// 		)
			// 		.then((resp) => {
			// 			console.log(resp);
			// 		})
			// 		.catch((err) => {
			// 			console.log(err);
			// 		});
			// },
			signingUp() {
				this.isSignedUp = !this.isSignedUp;
			},
			addClass(e) {
				console.log(e.currentTarget.id);
				if (e.currentTarget.id === "homepage") {
					this.mouseOutHome = "";
					this.mouseOverHome = "mouseover";
				} else if (e.currentTarget.id === "continent") {
					this.mouseOutContinent = "";
					this.mouseOverContinent = "mouseover";
				}
				// this.mouseOut = "";
				// this.mouseOver = "mouseover";
			},
			removeClass(e) {
				console.log(e.currentTarget.classList);
				// this.mouseOver = "";
				// this.mouseOut = "mouseout";
				if (e.currentTarget.id === "homepage") {
					this.mouseOverHome = "";
					this.mouseOutHome = "mouseout";
				} else if (e.currentTarget.id === "continent") {
					this.mouseOverContinent = "";
					this.mouseOutContinent = "mouseout";
				}
			},
		},
		beforeMount() {
			this.setCurrentCountry();
			this.getRegionFromApi();
		},
		components: { Notes, Header_button },
	};
</script>

<style scoped>
	.header__links {
		position: relative;
		font-size: 2em;
		display: flex;
		justify-content: space-between;
	}
	.header__links a {
		all: unset;
	}
	/* .links__position:hover a {
		animation: changecolor 0.5s ease forwards;
	} */
	/* .links__position:hover .link__underline {
		animation: 0.5s ease forwards hoverup;

	} */
	#homepage.mouseover .link__underline,
	#continent.mouseover .link__underline {
		animation: 0.5s ease forwards hoverup;
	}
	#homepage.mouseout .link__underline,
	#continent.mouseout .link__underline {
		animation: 0.3s ease forwards hoverdown;
	}
	#homepage.mouseover a,
	#continent.mouseover a {
		animation: changecolor 0.5s ease forwards;
	}
	#homepage.mouseout a,
	#continent.mouseout a {
		animation: removecolor 0.5s ease forwards;
	}
	.links__position {
		position: relative;
	}
	.link__underline {
		position: absolute;
		bottom: 0;
		height: 2px;
		width: 100%;
		background: #000;
		z-index: 100;
	}
	#homepage {
		margin: 0.5em;
	}
	#continent {
		margin: 0.5em;
	}
	.country__infos {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.country__infos > div {
		background: rgba(0, 0, 0, 0.3);
		width: 14%;
	}
	.country__infos h3 {
		/* border: solid; */
		background: #4b4b4e;
		color: #fff;
		margin: 0;
		padding: 0.5em;
		/* padding-top: 0; */
	}
	.country__infos p {
		/* border: solid; */
		padding-top: 2.5em;
		font-size: 1.2em;
	}
	.country__flag {
		box-shadow: black 1px 1px 5px 0px;
	}
	.img__container {
		width: 7em;
		margin: 0 auto;
	}
	.img__container img {
		width: 100%;
	}
	@keyframes hoverup {
		0% {
			bottom: 0;
		}
		20% {
			height: 15px;
		}
		80% {
			height: 2px;
		}
		100% {
			bottom: 95%;
		}
	}
	@keyframes hoverdown {
		0% {
			bottom: 95%;
		}
		40% {
			height: 15px;
		}
		80% {
			height: 2px;
		}
		100% {
			bottom: 0;
		}
	}
	@keyframes changecolor {
		0% {
			color: #000;
		}
		50% {
			color: red;
		}
		100% {
			color: red;
		}
	}
	@keyframes removecolor {
		0% {
			color: red;
		}
		95% {
			color: #000;
		}
		100% {
			color: #000;
		}
	}
</style>
