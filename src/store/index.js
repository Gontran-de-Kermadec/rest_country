import { createStore } from "vuex";

export const store = createStore({
	state: {
		currentCountry: "",
		userId: "",
		username: "",
		location: "",
		notes: [],
		imgsUrl: [],
		photosUrl: [],
		currentPhotosUrl: [],
	},
	mutations: {
		GET_CURRENT_COUNTRY(state, data) {
			state.currentCountry = data.toLowerCase();
			console.log(state.currentCountry);
		},
		GET_USER_ID(state, data) {
			state.userId = data.userId;
			console.log(state.userId);
		},
		GET_USERNAME(state, data) {
			const stringToArray = data.split("");
			stringToArray.splice(0, 1, stringToArray[0].toUpperCase());
			const username = stringToArray.join("");
			state.username = username;
			console.log(state.username);
		},
		GET_LOCATION(state, data) {
			state.location = data.location;
			console.log(state.location);
		},
		SAVE_NOTES(state, data) {
			if (data !== undefined) {
				state.notes.push(data);
			} else {
				state.notes = [];
			}
			console.log(state.notes);
		},
		SAVE_IMGS(state, data) {
			if (data !== undefined) {
				state.imgsUrl.push(data);
			} else {
				state.imgsUrl = [];
			}
			console.log(state.imgsUrl);
		},
		SAVE_PHOTOS(state, data) {
			if (data !== undefined) {
				state.photosUrl.push(data);
			} else {
				state.photosUrl = [];
			}
			console.log(state.photosUrl);
		},
		SAVE_CURRENT_PHOTOS(state, data) {
			if (data !== undefined) {
				state.currentPhotosUrl.push(data);
			} else {
				state.currentPhotosUrl = [];
			}
			console.log(state.currentPhotosUrl);
		},
	},
	actions: {},
});

export default store;
