import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
   apiKey: "AIzaSyB4jMxnVuIkHwAEmjXcuB9GtRTJsjhlAqg",

  authDomain: "kav-notification.firebaseapp.com",

  projectId: "kav-notification",

  storageBucket: "kav-notification.firebasestorage.app",

  messagingSenderId: "62544325884",

  appId: "1:62544325884:web:8ae9b3070166aa5fb7fb79",

  measurementId: "G-TT63KX1W5J"
};


const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
