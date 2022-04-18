// import Vue from "vue";
import Region from "../components/Region.vue";
import Homepage from "../components/Homepage.vue";
import Country from "../components/Country.vue";
import Profile from "../components/Profile.vue";
import { createRouter, createWebHistory } from "vue-router";

//Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Homepage",
		component: Homepage,
	},
	{
		path: "/:region",
		name: "Region",
		component: Region,
		props: true,
	},
	{
		path: "/:region/:country",
		name: "Country",
		component: Country,
	},
	{
		path: "/:username",
		name: "Profile",
		component: Profile,
	},
];

// const router = new VueRouter({
// 	mode: "history",
// 	routes,
// });
const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to) {
		console.log(to);
		if (to.hash) {
			return {
				selector: to.hash,
				behavior: "smooth",
			};
		}
	},
});

export default router;
