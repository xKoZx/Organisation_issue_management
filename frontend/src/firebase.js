import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyArXomLx71vZgCvHSaIorWlPcOoiDvdUK0",
    authDomain: "live-chat-8d8b6.firebaseapp.com",
    projectId: "live-chat-8d8b6",
    storageBucket: "live-chat-8d8b6.appspot.com",
    messagingSenderId: "569985273547",
    appId: "1:569985273547:web:94592c1f97dca3c286554e",
    measurementId: "G-0ZB610P3QX"
  };
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;