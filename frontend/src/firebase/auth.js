import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./config.js";
// Initialize Firebase Auth
const auth = getAuth(app);

auth.languageCode = "en";

const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const GoogleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, GoogleProvider);
};

const GithubProvider = new GithubAuthProvider();

const signInWithGitHub = () => {
  return signInWithPopup(auth, GithubProvider);
};

const signOutUser = () => {
  return signOut(auth);
};

export {
  loginWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signInWithGitHub,
  signOutUser,
  GoogleProvider,
  GithubProvider,
};
