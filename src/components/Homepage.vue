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
			getTarget(e) {
				this.region = e.target.innerText;
			},
		},
	};
</script>

<style scoped>
	.region__container {
		display: flex;
		height: 70vh;
	}
	.region__container .region__single {
		display: flex;
		justify-content: center;
		border: solid #fff 1px;
		height: 100%;
		background: #dddde3;
		transition: all 1s;
		flex-grow: 1;
	}
	.region__container .region__single:hover {
		background: #0d364a;
		flex-grow: 10;
		transition: all 2s;
	}

	.region__container .region__single p {
		transition: all 1s;
		color: #0d364a;
	}
	.region__container .region__single:hover p {
		font-size: 2.5em;
		transition: all 1s;
		color: #dddde3;
	}
	.region__container a {
		text-decoration: none;
		align-self: center;
		color: #0d364a;
	}
	.region__container p {
		transition: all 1s;
	}
</style>
