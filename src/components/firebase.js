import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTKZawF2nPgy7-tqPS5fWOnAD0DR110sc",
  authDomain: "sun-slack-clone.firebaseapp.com",
  databaseURL: "https://sun-slack-clone.firebaseio.com",
  projectId: "sun-slack-clone",
  storageBucket: "sun-slack-clone.appspot.com",
  messagingSenderId: "1028858270218",
  appId: "1:1028858270218:web:d7cc0e36877a12a70185f3"
};

firebase.initializeConfig(config);

export default firebase;