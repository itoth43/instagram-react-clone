import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyAGTmGqtuTIEkal5xI34btgqE2YFfexht8",
    authDomain: "react-ig-clone-bc11b.firebaseapp.com",
    databaseURL: "https://react-ig-clone-bc11b-default-rtdb.firebaseio.com",
    projectId: "react-ig-clone-bc11b",
    storageBucket: "react-ig-clone-bc11b.appspot.com",
    messagingSenderId: "766832163398",
    appId: "1:766832163398:web:9c28a7d136b780eccb2847",
    measurementId: "G-FZDQZTJVDE"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };