
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConf } from "./config";



// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
const app = initializeApp(firebaseConf);

export const db = getFirestore(app);


export const auth = getAuth(app);

export const storage = getStorage(app);