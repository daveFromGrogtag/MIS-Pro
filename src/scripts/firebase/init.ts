import { initializeApp } from "firebase/app";
import { getFirestore , setDoc, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDW0YjBSS8RbGaVFOiKpCxcUFXLvZKbcVs",
    authDomain: "print-mis-project.firebaseapp.com",
    projectId: "print-mis-project",
    storageBucket: "print-mis-project.appspot.com",
    messagingSenderId: "94461536609",
    appId: "1:94461536609:web:9ebbffbd4695ac1b577d20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore()
const storage = getStorage(app);

export {auth, db, setDoc, doc, storage}

