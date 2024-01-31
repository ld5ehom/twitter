import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBk8dSji1_y_lUXNZyZVqJnmxFs1VEHmeg",
  authDomain: "twitter-4ae9d.firebaseapp.com",
  projectId: "twitter-4ae9d",
  storageBucket: "twitter-4ae9d.appspot.com",
  messagingSenderId: "564353994504",
  appId: "1:564353994504:web:3acd5315e27fb1830aa6bd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); //ID 

export const storage = getStorage(app);  //Firebase storage

export const db = getFirestore(app);