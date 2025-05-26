// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { browser } from '$app/environment';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDp07Th7jLmzZxd1O4N2POhHYC53y79uMs',
	authDomain: 'gamifikasi-33e00.firebaseapp.com',
	projectId: 'gamifikasi-33e00',
	storageBucket: 'gamifikasi-33e00.firebasestorage.app',
	messagingSenderId: '560657650968',
	appId: '1:560657650968:web:1df7ea3ebbc09d5b607a6d',
	measurementId: 'G-2WRG2Z6KNS'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics in browser environment
export const analytics = browser ? getAnalytics(app) : null;
export const db = getFirestore(app);
