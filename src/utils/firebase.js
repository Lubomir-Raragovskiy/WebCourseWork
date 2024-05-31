import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyChkMVRuOibazGxEEBx78rQoe7qXeJUj-k",
    authDomain: "schoolmanagement-65c57.firebaseapp.com",
    databaseURL: "https://schoolmanagement-65c57-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "schoolmanagement-65c57",
    storageBucket: "schoolmanagement-65c57.appspot.com",
    messagingSenderId: "617310786984",
    appId: "1:617310786984:web:99f66cf4d3cf69a393399d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };