
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import {getAuth} from "firebase/auth"


const firebaseConfig = {

  apiKey: "AIzaSyDNM9_0hpvmqCoRzI3Dn9TdCaSP0QuF6-U",

  authDomain: "beerbuddies-df0e9.firebaseapp.com",

  databaseURL: "https://beerbuddies-df0e9-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "beerbuddies-df0e9",

  storageBucket: "beerbuddies-df0e9.appspot.com",

  messagingSenderId: "335975589044",

  appId: "1:335975589044:web:bc154468d9b1fb295223e1"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);