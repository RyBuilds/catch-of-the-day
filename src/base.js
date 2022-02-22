import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDzfPvcTibBNW3UbbvSSyVnOFEDH7zPUnQ",
  authDomain: "catch-of-the-day-rybuilds.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-rybuilds-default-rtdb.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

// THIS IS A NAMED EXPORT
export { firebaseApp };

// THIS IS A DEFAULT EXPORT
export default base;
