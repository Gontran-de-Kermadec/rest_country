<template>
	<div>
		<!-- <Homepage /> -->
		<!-- <router-link :to="{ name: 'Region', params: { region: 'Afrique' } }">
			<p>Afrique</p>
		</router-link> -->
		<router-view></router-view>
	</div>
</template>

<script>
	// import Homepage from "./components/Homepage.vue";
	export default {
		name: "App",
		// components: {
		// 	Homepage,
		// },
	};
</script>

<style>
	body {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.body__hidden {
		overflow-y: hidden;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	#app p {
		margin: 0;
	}
</style>
