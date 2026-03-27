import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTkFdo9aGZ3nd7NqMqgAqDHBMHbBAWO5g",
  authDomain: "mern-estate-final-be85e.firebaseapp.com",
  projectId: "mern-estate-final-be85e",
  storageBucket: "mern-estate-final-be85e.appspot.com", // ✅ FIXED
  messagingSenderId: "597980705075",
  appId: "1:597980705075:web:423634cfc46f854a5a8e46",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); // ✅ IMPORTANT