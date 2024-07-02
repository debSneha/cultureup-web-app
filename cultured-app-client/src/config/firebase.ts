import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

let firebaseConfig;

console.log("env", process.env.ENVIRONMENT)

if (process.env.ENVIRONMENT && process.env.ENVIRONMENT == "prod") {
  firebaseConfig = {
    apiKey: "AIzaSyA3uaQz8R68dKol90UcQf1kc193uCcKdlk",
    authDomain: "umeed-cultured-app.firebaseapp.com",
    projectId: "umeed-cultured-app",
    storageBucket: "umeed-cultured-app.appspot.com",
    messagingSenderId: "357628128886",
    appId: "1:357628128886:web:121f234fd3f3bb7b633957",
    measurementId: "G-8MFSY4DZ1K"
  };
}else{
  // Dev/Staging Config 
  firebaseConfig = {
      apiKey: "AIzaSyBBVLIyiEg2tTiegTmgkbK0fsbuD2LTFD8",
      authDomain: "cultured-up-app-dev.firebaseapp.com",
      projectId: "cultured-up-app-dev",
      storageBucket: "cultured-up-app-dev.appspot.com",
      messagingSenderId: "804747338969",
      appId: "1:804747338969:web:48820ef4301040c7c00ac8"
    };
}

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

