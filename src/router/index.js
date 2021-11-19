// import Vue from "vue";
// import VueRouter from "vue-router";
import Region from "../components/Region.vue";
import Homepage from "../components/Homepage.vue";
import Country from "../components/Country.vue";
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
	},
	{
		path: "/:region/:country",
		name: "Country",
		component: Country,
	},
];

// const router = new VueRouter({
// 	mode: "history",
// 	routes,
// });
const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
