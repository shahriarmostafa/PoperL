import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD84PaHJyi_u87Lm1z467NdbxYG58du9cg",
  authDomain: "poperl-1st.firebaseapp.com",
  projectId: "poperl-1st",
  storageBucket: "poperl-1st.appspot.com",
  messagingSenderId: "773002657354",
  appId: "1:773002657354:web:b2c94cbb82a7a302eef0b3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;
