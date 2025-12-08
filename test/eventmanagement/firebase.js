// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQkrvEWawL49tW0wyw_9UuAZhJwHG3Xbo",
  authDomain: "workeventmanager.firebaseapp.com",
  projectId: "workeventmanager",
  storageBucket: "workeventmanager.firebasestorage.app",
  messagingSenderId: "346892207098",
  appId: "1:346892207098:web:af16a7817916caf784da43",
  databaseURL: "https://workeventmanager-default-rtdb.firebaseio.com/"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, push, onValue, remove };
