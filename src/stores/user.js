import { defineStore } from "pinia";
import router from "@/router";

// Firebase
import { AUTH, DB } from "@/utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import errorCodes from "@/utils/fbcodes";

// Toasts
import { useToast } from "vue-toast-notification";
const $toast = useToast();

const DEFAULT_USER = {
	uid: null,
	email: null,
	firstname: null,
	lastname: null,
	isAdmin: null,
};

export const useUserStore = defineStore("user", {
	state: () => ({
		loading: false,
		user: DEFAULT_USER,
		auth: false,
	}),
	getters: {
		getUserData(state) {
			return state.user;
		},
		getUserId(state) {
			return state.user.uid;
		},
	},
	actions: {
		setUser(user) {
			this.user = { ...this.user, ...user };
			this.auth = true;
		},
		async signOut() {
			await signOut(AUTH);
			this.user = DEFAULT_USER;
			this.auth = false;
			router.push({ name: "home" });
		},
		async autosignin(uid) {
			try {
				const userData = await this.getUserProfile(uid);

				// Update local state
				this.setUser(userData);

				return true;
			} catch (error) {
				console.log(error);
			}
		},
		async getUserProfile(uid) {
			try {
				// Find User
				const userRef = await getDoc(doc(DB, "users", uid));

				// Throw Error if user doesn't exist
				if (!userRef.exists()) {
					throw new Error("Could not find user");
				}

				return userRef.data();
			} catch (error) {
				throw new Error(error.code);
			}
		},
		async signIn(formData) {
			try {
				this.loading = true;

				// Sign in User
				const res = await signInWithEmailAndPassword(AUTH, formData.email, formData.password);

				// Get user data
				const userData = await this.getUserProfile(res.user.uid);

				console.log(res.user.uid);

				// Update Local State
				this.setUser(userData);

				// Redirect User to dashboard
				router.push({ name: "dashboard" });
			} catch (error) {
				throw new Error(errorCodes(error.code));
			} finally {
				this.loading = false;
			}
		},
		async register(formData) {
			try {
				this.loading = true;

				// Register User
				const res = await createUserWithEmailAndPassword(AUTH, formData.email, formData.password);

				// Add user to DB
				const newUser = {
					uid: res.user.uid,
					email: res.user.email,
					isAdmin: false,
				};

				await setDoc(doc(DB, "users", res.user.uid), newUser);

				// Update Local State
				this.setUser(newUser);

				// Redirect User to dashboard
				router.push({ name: "dashboard" });
			} catch (error) {
				throw new Error(errorCodes(error.code));
			} finally {
				this.loading = false;
			}
		},
		async updateProfile(formData) {
			try {
				// Get User
				const userRef = doc(DB, "users", this.getUserId);

				// Update user
				await updateDoc(userRef, {
					...formData,
				});

				this.setUser(formData);

				// Toast
				$toast.success("User Updated", {
					position: "bottom",
				});
				return true;
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				throw new Error(error.message);
			}
		},
	},
});
