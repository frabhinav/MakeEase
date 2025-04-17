import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../pages/HomePage.css";

import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";

const LoginButton = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  const setChatHistory = useChatStore((state) => state.setChatHistory);

  const loginHandler = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Set user in stores
      setUser(user);
      setCurrentUser(user.uid);

      // Fetch chat history from Firestore
      const q = query(collection(db, "chats"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => doc.data().message);

      setChatHistory(user.uid, messages);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-buttons">
      <button
        onClick={() => loginHandler(googleProvider)}
        className="login-button"
      >
        Google
      </button>
      <button
        onClick={() => loginHandler(githubProvider)}
        className="login-button"
      >
        GitHub
      </button>
    </div>
  );
};

export default LoginButton;
