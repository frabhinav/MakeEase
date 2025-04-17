import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import useAuthStore from "../store/authStore";
import "../pages/HomePage.css";
// import "./SignInButton.css"; // optional CSS for styling

const SignInButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setShowDropdown(false); // close menu after sign in
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="signin-wrapper">
      <button
        className="signin-main-button"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        Sign In
      </button>

      {showDropdown && (
        <div className="signin-dropdown">
          <button onClick={() => handleSignIn(googleProvider)}>Google</button>
          <button onClick={() => handleSignIn(githubProvider)}>GitHub</button>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
