import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// import {...} from "firebase/database";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDW6QKkSRmgBhOJiQzdP1W0JxwqxXpq5IY",
  authDomain: "chat-app-ed7e5.firebaseapp.com",
  projectId: "chat-app-ed7e5",
  storageBucket: "chat-app-ed7e5.appspot.com",
  messagingSenderId: "688094010252",
  appId: "1:688094010252:web:a764344ae3c9e5d35854a9",
  measurementId: "G-ZCRM59HXWK",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
