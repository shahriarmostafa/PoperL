// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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



// steps of auth
// 1. Visitconsol.irews.google.com

// 2. create project (skip Google Analytics)

// 3. Register app (create config)

// 4. Add config file to your project

// 6. Visit go to docs >  build >  authentication web > get started

// 7. Export app from the firebase.config.js file: export default app

// 9. Login.jsx: input geOuth from firebase/auth

// 10. Create const = getAuth(app)

// 11. Import Google provider and create a new provider

// 12. Use sign in with pop up and pass auth provider

// 13. Active sign in method (Google Facebook github etc)