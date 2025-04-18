import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import Scene from "../components/Scene";
import SignInButton from "../components/signInButton";
import useAuthStore from "../store/authStore";
import useUIStore from "../store/uiStore"; // or authStore if you added it there
import MiniChatWindow from "../components/MiniChatWindow";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./HomePage.css";

const HomePage = () => {
  const { user, logout, dropdownOpen, toggleDropdown, closeDropdown } =
    useAuthStore();
  const { showChat, toggleChat, closeChat } = useUIStore();
  const handleLogout = () => {
    auth.signOut();
    logout();
  };

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/pianomusic.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch((e) => {
      console.warn("Autoplay failed:", e);
    });

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const pauseMusic = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  const playMusic = () => {
    if (audioRef.current && audioRef.current.paused) audioRef.current.play();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        useAuthStore.getState().setUser(user); // 👈 update Zustand state from Firebase
      }
    });

    return () => unsubscribe(); // 👈 clean up on unmount
  }, []);

  return (
    <div className="home-container">
      {/* Navbar at the top */}
      <div className="navbar">
        <Link to="/page2">
          <button className="home-button">soon</button>
        </Link>
        {/* <Link to="/ChatBot">
          <button className="home-button">ChatBot</button>
        </Link> */}

        {user ? (
          <div className="user-dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              Hi, {user.displayName?.split(" ")[0] || "User"} 👋
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
      {showChat && <MiniChatWindow onClose={closeChat} />}
      <button className="floating-chat-button" onClick={toggleChat}>
        💬
      </button>
      <h1 className="home-title">MakeEase</h1>

      <div className="scene-wrapper">
        <Scene onHoverStart={pauseMusic} onHoverEnd={playMusic} />
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="https://github.com/frabhinav"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/abhinav-karn"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
          <div className="footer-note">
            <p>
              © {new Date().getFullYear()} MakeEase • Crafted with care by
              Abhinav Karn
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
