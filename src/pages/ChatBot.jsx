// import useChatStore from "../store/chatStore";
// import ChatInput from "./ChatInput";
// import "./ChatBot.css"; // Import its own styles

// const ChatBot = () => {
//   const {
//     isSidebarOpen,
//     toggleSidebar,
//     currentUser,
//     setCurrentUser,
//     chatHistory,
//     addMessage,
//   } = useChatStore();

//   const messages = chatHistory[currentUser] || [];

//   return (
//     <div className="chatbot-layout">
//       <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//         <h2>Chat History</h2>
//         <ul className="chat-history">
//           {Object.keys(chatHistory).map((user) => (
//             <li
//               key={user}
//               className={user === currentUser ? "active" : ""}
//               onClick={() => setCurrentUser(user)}
//             >
//               {user}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="main-chat">
//         <header className="chatbot-header">
//           <button className="menu-toggle" onClick={toggleSidebar}>
//             ☰
//           </button>
//           <h1>{currentUser}'s Chat</h1>
//         </header>

//         <div className="chat-window">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`message ${
//                 i % 2 === 0 ? "user-message" : "bot-message"
//               }`}
//             >
//               {msg}
//             </div>
//           ))}
//         </div>

//         <ChatInput />
//       </div>
//     </div>
//   );
// };

// export default ChatBot;

import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import ChatInput from "./ChatInput";
import "./ChatBot.css";

const ChatBot = () => {
  const user = useAuthStore((state) => state.user);

  const {
    isSidebarOpen,
    toggleSidebar,
    currentUser,
    setCurrentUser,
    chatHistory,
    createNewChat,
    clearUserChats,
  } = useChatStore();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.uid); // Use UID as the user identifier
    } else {
      clearUserChats();
    }
  }, [user, setCurrentUser, clearUserChats]);

  const messages = chatHistory[currentUser] || [];

  return (
    <div className="chatbot-layout">
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2>Chat History</h2>

        <button className="new-chat-button" onClick={createNewChat}>
          + New Chat
        </button>

        <ul className="chat-history">
          {Object.entries(chatHistory).map(([chatId, messages]) => (
            <li
              key={chatId}
              className={chatId === currentUser ? "active" : ""}
              onClick={() => setCurrentUser(chatId)}
            >
              {messages.length > 0
                ? messages[0].slice(0, 20) + "..."
                : "New Chat"}
            </li>
          ))}
        </ul>
      </div>

      <div className="main-chat">
        <header className="chatbot-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>
            {currentUser
              ? `Chat with (${user?.displayName || "Guest"})`
              : "ChatBot"}
          </h1>
        </header>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                i % 2 === 0 ? "user-message" : "bot-message"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        <ChatInput currentChatId={currentUser} />
      </div>
    </div>
  );
};

export default ChatBot;
