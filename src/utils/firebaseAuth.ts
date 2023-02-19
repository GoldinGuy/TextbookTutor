import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: "treehacks-dfd7c.firebaseapp.com",
	projectId: "treehacks-dfd7c",
	storageBucket: "treehacks-dfd7c.appspot.com",
	messagingSenderId: "115545029115",
	appId: "1:115545029115:web:0f3c6e750c5dd9a637335e",
	measurementId: "G-9LSRKSSCD2",
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Don't initialize analytics in the server context
export let firebaseAnalytics = undefined;
if (typeof window !== "undefined") {
	// @ts-ignore
	firebaseAnalytics = getAnalytics(firebaseApp);
}

export const handleSignOut = () => {
	signOut(firebaseAuth);
};
