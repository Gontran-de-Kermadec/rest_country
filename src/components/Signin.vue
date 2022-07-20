<template>
	<div>
		<!--formulaire avec vue submit event qui declenche la fonction signin-->
		<div v-if="error.length > 0" class="form__error">{{ error }}</div>
		<form @submit.prevent="signin">
			<div>
				<input
					v-model="email"
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					class="form__input"
				/>
			</div>
			<div>
				<input
					v-model="password"
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					class="form__input"
				/>
			</div>
			<div>
				<button type="submit">Sign in</button>
			</div>
		</form>
		<div @click="resetPassword">Forgot Password ?</div>
	</div>
</template>

<script>
	import "../firebaseConfig";
	import {
		getAuth,
		signInWithEmailAndPassword,
		sendPasswordResetEmail,
	} from "firebase/auth";
	const auth = getAuth();
	export default {
		name: "Signin",
		data() {
			return {
				email: "",
				password: "",
				error: "",
			};
		},
		methods: {
			signin() {
				this.error = "";
				signInWithEmailAndPassword(auth, this.email, this.password)
					.then((userCredential) => {
						// Signed in
						const user = userCredential.user;
						console.log(user);
					})
					.catch((error) => {
						const errorCode = error.code;
						console.log(errorCode);
						//this.error = error.message;
						this.error = "Incorrect email address or password !!";
					});
			},
			resetPassword() {
				const actionCodeSettings = {
					url: "http://localhost:8080/",
					//   url: 'https://www.example.com/?email=' + firebase.auth().currentUser.email,
				};
				console.log(auth, this.email);
				const email = prompt("please enter your email address");
				console.log(email);
				sendPasswordResetEmail(auth, email, actionCodeSettings)
					.then(() => {
						// Password reset email sent!
						// ..
						console.log("reset email sent");
						alert("Password resert email sent !! Have a look in your spam.");
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.log(errorCode, errorMessage);
					});
			},
		},
	};
</script>

<style scoped>
	form {
		margin-top: 1em;
	}
	.form__input {
		all: unset;
		/* border-bottom: solid;
		border-top: solid; */
		text-align: left;
		padding: 0.5em 0;
	}
	#email {
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
	.form__error {
		margin-top: 2em;
		color: red;
	}
</style>
