import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBDNJNBH3QhU1VizmgeJve0d3USMdGkePY",
  authDomain: "studybuddy-26b1a.firebaseapp.com",
  projectId: "studybuddy-26b1a",
  storageBucket: "studybuddy-26b1a.appspot.com",
  messagingSenderId: "957638275859",
  appId: "1:957638275859:web:31ba41e81854a570a4e0e6",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)