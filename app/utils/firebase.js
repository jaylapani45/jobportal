import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyCRqmmlRsiWD6OupOm0lB3_6PFWpxd2H2A",
	authDomain: "internship-ee32f.firebaseapp.com",
	projectId: "internship-ee32f",
	storageBucket: "internship-ee32f.appspot.com",
	messagingSenderId: "899662839887",
	appId: "1:899662839887:web:70acf620773aa6f2ff6a3a",
	measurementId: "G-GTL1NXLTV4"
  };

let fire;
if (!getApps().length) {
  fire = initializeApp(firebaseConfig);
} else {
  fire = getApp();
}
export {fire};
