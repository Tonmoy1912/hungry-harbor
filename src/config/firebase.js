// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export async function getFirebaseStorage(){
    let res=await fetch("/api/apikeys/firebase",{cache:"no-store"});
    res=await res.json();
    const firebaseConfig=res.firebaseConfig;
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    return storage;
}