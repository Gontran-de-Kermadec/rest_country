<template>
	<div>
		<form @submit.prevent="signup">
			<!-- <form @submit.prevent="formValidation"> -->
			<div class="form__control">
				<input
					v-model="username"
					type="text"
					name="username"
					id="username"
					placeholder="Username"
					required
					@blur="usernameValidation"
				/>
				<div v-if="usernameSucces" class="success"></div>
				<div v-if="usernameError.length > 0" class="error">
					<p>{{ usernameError }}</p>
				</div>
			</div>
			<div class="form__control">
				<input
					v-model="email"
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					required
					@blur="emailValidation"
				/>
				<div v-if="emailSuccess" class="success"></div>
				<div v-if="emailError.length > 0" class="error">
					<p>{{ emailError }}</p>
				</div>
			</div>
			<div class="form__control">
				<input
					v-model="password"
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					required
					@blur="passwordValidation"
				/>
				<div v-if="passwordSuccess" class="success"></div>
				<div v-if="passwordError.length > 0" class="error">
					<p>{{ passwordError }}</p>
				</div>
			</div>
			<div class="form__control">
				<input
					v-model="passwordConfirm"
					type="password"
					name="passwordConfirm"
					id="passwordConfirm"
					placeholder="Confirm password"
					required
					@blur="confirmPassword"
				/>
				<div v-if="confirmPasswordSuccess" class="success"></div>
				<div v-if="confirmPasswordError.length > 0" class="error">
					<p>{{ confirmPasswordError }}</p>
				</div>
			</div>
			<button type="submit" :disabled="isDisabled">Sign up</button>
		</form>
	</div>
</template>

<script>
	//import * as firebase from "firebase/app";
	import "../firebaseConfig";
	import {
		getAuth,
		createUserWithEmailAndPassword,
		//onAuthStateChanged,
	} from "firebase/auth";
	import { getFirestore, collection, addDoc } from "firebase/firestore";
	//console.log(createUserWithEmailAndPassword);
	const auth = getAuth();
	const db = getFirestore();
	export default {
		name: "Signup",
		data() {
			return {
				username: "",
				email: "",
				password: "",
				passwordConfirm: "",
				isDisabled: true,

				//username
				usernameSucces: false,
				usernameError: "",

				//email
				emailSuccess: false,
				emailError: "",

				//password
				passwordSuccess: false,
				passwordError: "",

				//comfirm password
				confirmPasswordSuccess: false,
				confirmPasswordError: "",
			};
		},
		methods: {
			usernameValidation() {
				const usernameRegex = new RegExp("^[a-zA-Z0-9-_.]{2,}$", "g");
				if (usernameRegex.test(this.username)) {
					this.usernameSucces = true;
					this.usernameError = "";
					//this.succes = true;
					console.log("success");
				} else {
					this.usernameSucces = false;
					this.usernameError = "Special characters or empty";
					//this.error = true;
					console.log("error");
				}
			},
			emailValidation() {
				const emailRegex = new RegExp(
					"^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
					"g"
				);
				if (emailRegex.test(this.email)) {
					this.emailSuccess = true;
					this.emailError = "";
				} else {
					this.emailSuccess = false;
					this.emailError = "Incorrect email address";
				}
			},
			passwordValidation() {
				//password
				const passwordRegex = new RegExp(`['=?"]`, "g");
				console.log(this.password.length);
				if (this.password.length > 8) {
					if (passwordRegex.test(this.password)) {
						this.passwordSuccess = false;
						this.passwordError = `do not use the following characters '=?"`;
					} else {
						this.passwordSuccess = true;
						this.passwordError = "";
					}
				} else {
					this.passwordSuccess = false;
					this.passwordError = "8 characters minimun";
				}
			},
			confirmPassword() {
				if (this.password === this.passwordConfirm) {
					console.log("meme mot de passe");
					this.confirmPasswordSuccess = true;
					this.confirmPasswordError = "";
					this.formValidation();
				} else {
					console.log("mdp different");
					this.confirmPasswordSuccess = false;
					this.confirmPasswordError = "password is different";
				}
			},
			formValidation() {
				if (
					this.usernameSucces &&
					this.emailSuccess &&
					this.passwordSuccess &&
					this.confirmPasswordSuccess
				) {
					console.log("all good to create account");
					this.isDisabled = false;
					//this.signup();
				} else {
					this.isDisabled = true;
				}
			},
			signup() {
				console.log(this.email, this.password);
				createUserWithEmailAndPassword(auth, this.email, this.password)
					.then((userCredential) => {
						// Signed in
						const user = userCredential.user;
						console.log(user.uid);
						this.createUserFile(user.uid);
					})
					.catch((error) => {
						const errorCode = error.code;
						console.log(errorCode);
						this.error = error.message;
					});
			},
			async createUserFile(userId) {
				console.log(this.country, this.note, this.location, this.user);
				// Add a new document with a generated id.
				const docRef = await addDoc(collection(db, "users"), {
					username: this.username,
					mail: this.email,
					userId: userId,
				});
				console.log("Document written with ID: ", docRef.id);
			},
		},
		// mounted() {
		// },
	};
</script>

<style scoped>
	form {
		margin-top: 2em;
	}
	.form__control {
		position: relative;
	}
	input {
		all: unset;
		text-align: left;
		padding: 0.5em 0;
	}
	#email,
	#username,
	#password {
		border-bottom: solid;
	}
	button {
		all: unset;
		cursor: pointer;
		margin: 1em 0;
		border: solid;
		padding: 0.5em 1em;
		background: lightyellow;
	}
	.success {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: green;
		right: 37%;
		width: 5vw;
		z-index: -10;
		height: 20%;
	}
	.error {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		color: red;
		width: 20vw;
		right: 15%;
		z-index: -10;
	}
</style>
