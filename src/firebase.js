import { initializeApp } from "firebase/app";
import useChatStore from "./store/chatStore";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import useAuthStore from "./store/authStore";

const firebaseConfig = {
  apiKey: "AIzaSyD8IeDNnF5DLFzlWJuy4pnukzC8VHBey0w",
  authDomain: "chatapp-747fd.firebaseapp.com",
  projectId: "chatapp-747fd",
  storageBucket: "chatapp-747fd.firebasestorage.app",
  messagingSenderId: "419469217325",
  appId: "1:419469217325:web:5f95d42f70bcb9a946f2a4",
};

const provider = new GoogleAuthProvider();

const handleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  useAuthStore.getState().setUser(result.user);
  await useChatStore.getState().loadUserChats(); // 👈 fetch chats from DB
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, githubProvider, signInWithPopup };
