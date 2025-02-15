import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apikey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const messaging = getMessaging(app);

export const requestForToken = async() => {
  try{
    const token = await getToken(messaging, {vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY});
    if(token){      
      return token;
    }
    else{
      console.log("Nottification Access denied");
      
    }
  }
  catch(err){
    console.error("Error getting FCM token:", err);
  }
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
});


// Initialize Firebase Authentication and get a reference to the service
export const db = getFirestore(app)
export default auth;
