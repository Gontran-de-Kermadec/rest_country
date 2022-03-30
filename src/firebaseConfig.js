require("dotenv").config();
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	//apiKey: "AIzaSyD5zxiTjXe2Wl63qJvEU41SAPS-z22e2_4",
	apiKey: process.env.VUE_APP_API_KEY,
	//authDomain: "rest-country.firebaseapp.com",
	authDomain: process.env.VUE_APP_AUTH_DOMAIN,
	//projectId: "rest-country",
	projectId: process.env.VUE_APP_PROJECT_ID,
	//storageBucket: "rest-country.appspot.com",
	storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
	//messagingSenderId: "306548709821",
	messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
	//appId: "1:306548709821:web:adb8c0a04c6859b47a5ad4",
	appId: process.env.VUE_APP_APP_ID,
};
const app = initializeApp(firebaseConfig);

export default app;
