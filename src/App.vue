<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: "App",
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
		color: #0d1f2d;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	#app p {
		margin: 0;
	}
</style>
