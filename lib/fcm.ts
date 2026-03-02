import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let messaging: any = null;

export const initFirebase = () => {
  // 🚨 VERY IMPORTANT: run only in browser
  if (typeof window === "undefined") return null;

  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);

  return messaging;
};

export const requestFCMToken = async () => {
  try {
    if (typeof window === "undefined") return;

    const messaging = initFirebase();
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    if (token) {
      console.log("🔥 FCM token:", token);
      return token;
    }
  } catch (error) {
    console.error("FCM error:", error);
  }
};

export const listenToMessages = () => {
  if (typeof window === "undefined") return;

  const messaging = initFirebase();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("📩 Message received:", payload);
  });
};
