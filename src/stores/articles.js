import { defineStore } from "pinia";
import router from "@/router";
import { useUserStore } from "./user";

// Toasts
import { useToast } from "vue-toast-notification";
const $toast = useToast();

let articlesCol = collection(DB, "articles");

// FIREBASE
import { DB } from "@/utils/firebase";
import {
	collection,
	getDoc,
	doc,
	setDoc,
	serverTimestamp,
	updateDoc,
	query,
	orderBy,
	getDocs,
	limit,
	startAfter,
	deleteDoc,
} from "firebase/firestore";

export const useArticleStore = defineStore("article", {
	state: () => ({
		homeArticles: "",
		adminArticles: "",
		adminLastVisible: "",
	}),
	getters: {
		getFeaturedSlides(state) {
			return state.homeArticles.slice(0, 2);
		},
		getHomeArticles(state) {
			return state.homeArticles;
		},
	},
	actions: {
		async updateArticle(id, formData) {
			try {
				const docRef = doc(DB, "articles", id);
				await updateDoc(docRef, {
					...formData,
				});

				// Show toast
				$toast.success("Updated", {
					position: "bottom",
				});

				return true;
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				throw new Error(error);
			}
		},
		async getArticleById(id) {
			try {
				const docRef = await getDoc(doc(DB, "articles", id));
				if (!docRef.exists()) {
					throw new Error("Could not find document");
				}
				return docRef.data();
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				router.push({ name: "404" });

				throw new Error(error.message);
			}
		},
		async addArticle(formData) {
			try {
				// Get user data
				const userStore = useUserStore();
				const user = userStore.getUserData;

				// Post Doc in DB
				const newArticle = doc(articlesCol);
				await setDoc(newArticle, {
					timestamp: serverTimestamp(),
					owner: {
						uid: user.uid,
						firstname: user.firstname,
						lastname: user.lastname,
					},
					...formData,
				});

				// Redirect user
				router.push({ name: "admin_articles", query: { reload: true } });
				return true;
			} catch (error) {
				throw new Error(error);
			}
		},
		async adminGetArticles(docLimit) {
			try {
				// Define Query
				const q = query(articlesCol, orderBy("timestamp", "desc"), limit(docLimit));

				// Use query to get the docs
				const querySnapshot = await getDocs(q);

				// Define the last article in the querys limit
				const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

				// Transform querySnapshot into data we can use
				const articles = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Update admin articles local state
				this.adminArticles = articles;
				this.adminLastVisible = lastVisible;
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				throw new Error(error);
			}
		},
		async adminGetMoreArticles(docLimit) {
			try {
				if (this.adminLastVisible) {
					// Define the old articles
					let oldArticles = this.adminArticles;

					// Define Query with startAfter
					const q = query(
						articlesCol,
						orderBy("timestamp", "desc"),
						startAfter(this.adminLastVisible),
						limit(docLimit)
					);

					// Use query to get the docs
					const querySnapshot = await getDocs(q);

					// Define the last article in new array
					const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

					// Transform new querySnapshot into data we can use
					const newArticles = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));

					// Update local storage and merge adminArticles with new and old data
					this.adminArticles = [...oldArticles, ...newArticles];
					this.adminLastVisible = lastVisible;
				}
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				throw new Error(error);
			}
		},
		async removeById(articleID) {
			try {
				// Delete Doc from DB
				await deleteDoc(doc(DB, "articles", articleID));

				// Filter out the id provided from the adminArticles local storage
				const newList = this.adminArticles.filter((x) => {
					return x.id != articleID;
				});

				// Update the local storage
				this.adminArticles = newList;

				// Show toast
				$toast.success("Deleted", {
					position: "bottom",
				});
			} catch (error) {
				$toast.error(error.message, {
					position: "bottom",
				});
				throw new Error(error);
			}
		},
		async getArticles(docLimit) {
			try {
				// Define Query
				const q = query(articlesCol, orderBy("timestamp", "desc"), limit(docLimit));

				// Use query to fetch docs from DB
				const querySnapshot = await getDocs(q);

				// Transform querySnapshot into what we need
				const articles = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Update local Storage for home articles
				this.homeArticles = articles;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	},
});
