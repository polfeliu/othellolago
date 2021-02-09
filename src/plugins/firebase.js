import firebase from "firebase/app"; // by importing the app the other modules are not loaded by default
import "firebase/firestore"

export const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBathlrYbl7dtxw0d936YiNotgYOgY9tVM",
    authDomain: "jocvueling.firebaseapp.com",
    databaseURL: "https://jocvueling.firebaseio.com",
    projectId: "jocvueling",
    storageBucket: "jocvueling.appspot.com",
    messagingSenderId: "156448207381",
    appId: "1:156448207381:web:5400ef4ff537b80dee541c"
});

//https://medium.com/vue-mastery/full-stack-vue-js-with-firestore-62e2fe2ec1f3
export const db = firebaseApp.firestore();
