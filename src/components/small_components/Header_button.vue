<template>
	<div class="header__links">
		<div
			:id="leftButtonId"
			:class="[mouseOverLeft, mouseLeaveLeft]"
			@mouseover="addClass"
			@mouseleave="removeClass"
		>
			<div class="links__position">
				<router-link :to="{ name: leftButtonId }">{{
					leftButtonId
				}}</router-link>
				<div class="link__underline"></div>
			</div>
		</div>
		<div
			:id="rightButtonId"
			:class="[mouseOverRight, mouseLeaveRight]"
			@mouseover="addClass"
			@mouseleave="removeClass"
		>
			<div class="links__position" v-if="rightButtonId === 'continent'">
				<router-link :to="{ name: 'Region', params: { region: region } }"
					>{{ region }}
				</router-link>
				<div class="link__underline"></div>
			</div>
			<div class="links__position" v-else>
				<button @click="logOut">Logout</button>
				<div class="link__underline"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getAuth, signOut } from "firebase/auth";
	const auth = getAuth();
	export default {
		name: "Header_button",
		props: ["leftButtonId", "rightButtonId", "region"],
		data() {
			return {
				mouseOverLeft: "",
				mouseLeaveLeft: "",
				mouseOverRight: "",
				mouseLeaveRight: "",
			};
		},
		methods: {
			addClass(e) {
				console.log(e.currentTarget.id);
				//if (e.currentTarget.id === "homepage") {
				if (e.currentTarget.id === this.leftButtonId) {
					this.mouseLeaveLeft = "";
					this.mouseOverLeft = "mouseover";
					//} else if (e.currentTarget.id === "continent") {
				} else if (e.currentTarget.id === this.rightButtonId) {
					this.mouseLeaveRight = "";
					this.mouseOverRight = "mouseover";
				}
			},
			removeClass(e) {
				console.log(e.currentTarget.classList);
				if (e.currentTarget.id === this.leftButtonId) {
					this.mouseOverLeft = "";
					this.mouseLeaveLeft = "mouseout";
					//} else if (e.currentTarget.id === "continent") {
				} else if (e.currentTarget.id === this.rightButtonId) {
					this.mouseOverRight = "";
					this.mouseLeaveRight = "mouseout";
				}
			},
			logOut() {
				signOut(auth)
					.then(() => {
						console.log("Sign-out successful.");
						this.$router.push({ name: "Homepage" });
					})
					.catch((error) => {
						console.log(error);
					});
			},
		},
	};
</script>

<style scoped>
	.header__links {
		position: relative;
		font-size: 2em;
		display: flex;
		justify-content: space-between;
	}
	.header__links a,
	.header__links button {
		all: unset;
		cursor: pointer;
	}
	#Homepage.mouseover .link__underline,
	#logout.mouseover .link__underline,
	#continent.mouseover .link__underline {
		animation: 0.5s ease forwards hoverup;
	}
	#Homepage.mouseout .link__underline,
	#logout.mouseout .link__underline,
	#continent.mouseout .link__underline {
		animation: 0.3s ease forwards hoverdown;
	}
	#Homepage.mouseover a,
	#logout.mouseover button,
	#continent.mouseover a {
		animation: changecolor 0.5s ease forwards;
	}
	#Homepage.mouseout a,
	#logout.mouseout button,
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
	#Homepage,
	#logout {
		margin: 0.5em;
	}
	#continent {
		margin: 0.5em;
	}
	/* .country__infos {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.country__infos h3 {
		padding: 1em;
	} */
	/* .img__container {
		width: 7em;
		margin: 0 auto;
	}
	.img__container img {
		width: 100%;
	} */
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
>
